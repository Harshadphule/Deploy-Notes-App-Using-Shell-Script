#!/bin/bash
<< task
Deploying notes app and handeling errors
task

install_git() {
echo "installing git.......... "
sudo yum install git -y
}

code_clone() {
         echo "Cloning the code ......"
         git clone https://github.com/Harshadphule/Deploy-Notes-App-Using-Shell-Script.git
         echo " repo cloned........ "
}

install_requirements() {
      echo " installing dependencies........ "
      sudo yum install docker -y
      sudo yum install nginx -y
}

required_restarts() {

        sudo systemctl enable docker
        sudo systemctl enable nginx
        sudo systemctl start docker
        sudo systemctl restart docker
}

deploy(){
  cd Deploy-Notes-App-Using-Shell-Script
  cd Notes-app-code
  docker build -t notes-app .
  docker run -d -p 5001:80 notes-app:latest
}

echo "################################### Deployment started #####################################"

if ! install_git; then
        echo " git installation failed "
        exit 1
fi

if ! code_clone; then
        echo " the code allready exists ........."
fi

if ! install_requirements; then
        echo "installation failed...."
        exit 1
fi

if ! required_restarts; then
        echo " system fault identified "
        exit 1
fi

if ! deploy; then
        echo " deployment failed ..mailing the admin "
        # sendmail
fi

echo "################################### Deployment Done ##################################"