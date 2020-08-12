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



        function showBubble(id, message) {
            $('#' + id).find('.message').show().html(message);

            setTimeout(() => {
                $('#' + id).find('.message').hide();

            }, 2000);

        }

        function initSocket(userName) {

            const socket = io.connect('https://live-ball.herokuapp.com/');
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
                    setTimeout(() => {
                        const element = document.getElementById('chat-area');
                        element.scrollTop = element.scrollHeight;

                    });
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
                    setTimeout(() => {
                        const element = document.getElementById('chat-area');
                        element.scrollTop = element.scrollHeight;

                    });
                    $scope.$apply();
                });

                socket.on('animate', (data) => {
                    $('#' + data.socketId).animate({ 'left': data.x, 'top': data.y });
                });

                socket.on('newMessage', (data) => {
                    $scope.messages.push(data);
                    $scope.$apply();

                    showBubble(data.socketId, data.text);
                    setTimeout(() => {
                        const element = document.getElementById('chat-area');
                        element.scrollTop = element.scrollHeight;

                    });
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

                $scope.newMessage = () => {
                    let message = $scope.message;
                    const messageData = {
                        type: {
                            code: 1, // server or user message
                        },
                        username: userName,
                        text: message
                    };

                    $scope.messages.push(messageData);
                    $scope.message = '';

                    socket.emit('newMessage', messageData);
                    showBubble(socket.id, message);

                    setTimeout(() => {
                        const element = document.getElementById('chat-area');
                        element.scrollTop = element.scrollHeight;

                    });
                };


            });

            socket.on('connect_error', (err) => {
                console.log(err);
            });
        }

    };


}]);