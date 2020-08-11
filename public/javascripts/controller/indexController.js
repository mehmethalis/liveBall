app.controller('indexController', ['$scope', ($scope) => {

    $scope.messages = [];
    $scope.players = {};


    $scope.init = () => {
        const userName = prompt('please enter username');
        if (userName) {
            initSocket(userName);
        } else {
            return false;
        }

        function initSocket(userName) {

            const socket = io.connect('http://localhost:3000');
            socket.on('connect', () => {
                console.log('connection success');
                socket.emit('newUser', { userName: userName });

                socket.on('initPlayers', (players) => {
                    $scope.players = players;
                    $scope.$apply();


                });

                socket.on('newUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0, // server or user message
                            message: 1 //login or log out
                        },
                        username: data.userName
                    }

                    $scope.messages.push(messageData);
                    $scope.players[data.id] = data;
                    $scope.$apply();
                });

                socket.on('disUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0,
                            message: 0
                        },
                        username: data.userName
                    }
                    $scope.messages.push(messageData);
                    delete $scope.players[data.id];
                    $scope.$apply();
                });

                socket.on('animate', (data) => {
                    $('#' + data.socketId).animate({ 'left': data.x, 'top': data.y });
                });


                let animate = false;
                $scope.onClickPlayer = ($event) => {

                    if (!animate) {
                        let x = $event.offsetX;
                        let y = $event.offsetY;

                        socket.emit('animate', { x, y });

                        animate = true;
                        $('#' + socket.id).animate({ 'left': x, 'top': y });
                        animate = false;
                    }
                };


            });

            socket.on('connect_error', (err) => {
                console.log(err);
            });
        }

    };


}]);