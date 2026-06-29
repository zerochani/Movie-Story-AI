const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export function streamGenerateStory(
    theme: string,
    onEvent: (type: string, data: unknown) => void,
    onError: (msg: string) => void,
): AbortController {
    //HTTP 요청을 중간에 취소할 수 있는 도구
    const controller = new AbortController();

    fetch(`${BASE_URL}/stories/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }), //딕셔너리를 JSON 문자열로 변환해 보냄
        signal: controller.signal, //이걸 넘겨야 abort() 작동
    })
        .then(async (res) => {
            if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
            if (!res.body) throw new Error('스트림이 없습니다.');

            const reader = res.body.getReader(); //스트림을 읽기 위한 reader 생성
            const decoder = new TextDecoder(); //바이트를 문자열로 변환하기 위한 decoder 생성
            let buffer = ''; //여러 청크에 걸쳐서 올 수 있는 데이터를 임시 저장 

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true }); //stream: true 옵션을 주면, 데이터가 아직 더 올 수 있음
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                let currentEvent = '';
                for (const line of lines) {
                    if (line.startsWith('event: ')) {
                        currentEvent = line.slice(7).trim();
                    } else if (line.startsWith('data: ')) {
                        //try/catch로 감싼 이유는 JSON 파싱이 실패해도 앱이 멈추지 않게 하기 위함
                        try {
                            const parsed = JSON.parse(line.slice(6));
                            onEvent(currentEvent, parsed);
                        } catch {
                            // 파싱 실패 무시
                        }
                    }
                }
            }
        })
        .catch((err) => {
            //네트워크 오류나 서버 오류만 onError로 전달하고, 사용자가 취소한 경우는 무시
            if (err.name !== 'AbortError') {
                onError(err.message ?? '알 수 없는 오류');
            }
        });

    return controller;
}

export function streamContinueStory(
    sessionId: string, //어떤 스토리인지
    selectedOption: string, //사용자가 선택한 것 
    onEvent: (type: string, data: unknown) => void,
    onError: (msg: string) => void,
): AbortController {
    const controller = new AbortController();

    fetch(`${BASE_URL}/stories/continue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            session_id: sessionId,
            selected_option: selectedOption,
        }),
        signal: controller.signal,
    })
        .then(async (res) => {
            if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
            if (!res.body) throw new Error('스트림이 없습니다.');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                let currentEvent = '';
                for (const line of lines) {
                    if (line.startsWith('event: ')) {
                        currentEvent = line.slice(7).trim();
                    } else if (line.startsWith('data: ')) {
                        try {
                            const parsed = JSON.parse(line.slice(6));
                            onEvent(currentEvent, parsed);
                        } catch {
                            // 파싱 실패 무시
                        }
                    }
                }
            }
        })
        .catch((err) => {
            if (err.name !== 'AbortError') {
                onError(err.message ?? '알 수 없는 오류');
            }
        });

    return controller;
}