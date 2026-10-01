# Deploy Notes App Using Shell Script

Automates deploying the Notes App on an AWS EC2 instance using a shell script, Docker, and Nginx.

Repository: [Deploy-Notes-App-Using-Shell-Script](https://github.com/Harshadphule/Deploy-Notes-App-Using-Shell-Script)

## Prerequisites

- An AWS account
- An EC2 instance (Ubuntu) with SSH access

## Steps

### 1. Launch the EC2 Server

1. Launch an Ubuntu EC2 instance.
2. SSH into the instance:

```bash
ssh -i <your-key>.pem ubuntu@<public-ip>
```

### 2. Create and Run the Shell Script

```bash
vi deploy.sh
chmod 744 deploy.sh
./deploy.sh
```

### 3. What the Script Automates

- Clones the repository: `https://github.com/Harshadphule/Deploy-Notes-App-Using-Shell-Script.git`
- Moves into the `Notes-app-code` folder
- Installs Docker, Docker Compose, and Nginx
- Starts and enables Docker and Nginx
- Builds the Docker image from the Dockerfile
- Runs the container and exposes the app port

### 4. Access the Application

Edit the EC2 instance's Security Group inbound rules and add:

| Type       | Port              | Source    |
|------------|-------------------|-----------|
| Custom TCP | Your exposed port | 0.0.0.0/0 |

Then open `http://<public-ip>:<port>` in your browser.

## Required Tools

**Docker**

```bash
sudo apt-get install docker.io -y
```

**Docker Compose**

```bash
sudo apt-get install docker-compose -y
```

**Nginx**

```bash
sudo apt-get install nginx -y
```
