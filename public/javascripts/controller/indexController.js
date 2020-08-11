app.controller('indexController', ['$scope', ($scope) => {

    $scope.messages = [];

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

                socket.on('newUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0, // server or user message
                            message: 1 //login or log out
                        },
                        username: data.userName
                    }

                    $scope.messages.push(messageData);
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
                    $scope.$apply();
                });


            });

            socket.on('connect_error', (err) => {
                console.log(err);
            });
        }

    };


}]);