const WebSocket = require('ws');

//npm i ws 설치 필요
//하나의 ws 통로로 계속 소통. n초 마다 포트 열고 뭐 할 필요가 없어짐
module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => { // 웹소켓 연결 시(프론트에서 웹 소켓 생성 시 실행 됨
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //ip 파악
    console.log('새로운 클라이언트 접속', ip);
    ws.on('message', (message) => { // 클라이언트로부터 메시지 보낸 것을 받아옴
      console.log(message.toString());
    });
    ws.on('error', (error) => { // 에러 처리
      console.error(error);
    });
    ws.on('close', () => { // 연결 종료 시
      console.log('클라이언트 접속 해제', ip);
      clearInterval(ws.interval); //클라이언트 접속이 끊기면 3초마다 오는 메세지도 끊기게
    });

    ws.interval = setInterval(() => { // 3초마다 클라이언트로 메시지 전송
      if (ws.readyState === ws.OPEN) {
        ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
      }
    }, 3000);
  });
};
