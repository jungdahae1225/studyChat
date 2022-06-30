const SocketIO = require('socket.io');

module.exports = (server) => {
  const io = SocketIO(server, { path: '/socket.io' }); //socket.io서버와 express 서버와 연결 코드

  io.on('connection', (socket) => { // 웹소켓 연결 시
    const req = socket.request; //요청 값 받아오기
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //ip 찾기
    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip); //채팅방 내보내기, 귓속말 처리 등 -> 등은 soket.id를 사용하여 가능
    
    socket.on('disconnect', () => { // 연결 종료 시
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });
    socket.on('error', (error) => { // 에러 시
      console.error(error);
    });
    socket.on('reply', (data) => { // 클라이언트로부터 메시지
      console.log(data);
    });
    socket.interval = setInterval(() => { // 3초마다 클라이언트로 메시지 전송
      socket.emit('news', 'Hello Socket.IO'); //news라는 이벤트에 hello soket.io라는 메세지를 보내라는 것
    }, 3000);
  });
};
