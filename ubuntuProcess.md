# EC2/Ubuntu step by step

## Python install

```shell
ubuntu@ip-172-31-36-243:~$ python3 --version
Python 3.12.3
```

## pip3 install

1. Update all present packages that necessary

    ```shell
    ubuntu@ip-172-31-36-243:~/WehelpStage2$ sudo apt update
    Get:1 http://ap-southeast-2.ec2.archive.ubuntu.com/ubuntu noble InRelease [256 kB]
    ...                              
    Reading package lists... Done
    Building dependency tree... Done
    Reading state information... Done
    37 packages can be upgraded. Run 'apt list --upgradable' to see them.
    ```

2. Install pip with python3

    ```shell
    ubuntu@ip-172-31-36-243:~/WehelpStage2$ sudo apt install python3-pip
    ubuntu@ip-172-31-36-243:~/WehelpStage2$ pip3 --version
    pip 24.0 from /usr/lib/python3/dist-packages/pip (python 3.12)
    ```

## MySQL install

```shell
ubuntu@ip-172-31-36-243:~/WehelpStage2$ sudo apt install mysql-server
ubuntu@ip-172-31-36-243:~/WehelpStage2$ mysql --version
mysql  Ver 8.0.36-2ubuntu3 for Linux on x86_64 ((Ubuntu))
```

## MySQL configuration

```shell
ubuntu@ip-172-31-36-243:~/WehelpStage2$ sudo mysql_secure_installation
...
#Mysql by default has root user's authentication plugin as auth_socket, which requires the system user name and db user name to be the same.
#Specifically, log in as root or sudo -i and just type mysql and you will be logged in as mysql root, you can then create other operating users.
...
ubuntu@ip-172-31-36-243:~/WehelpStage2$ sudo -i
root@ip-172-31-36-243:~# mysql
```

## Setting new user

```sql
mysql> CREATE USER '...'@'%' IDENTIFIED BY '...';
Query OK, 0 rows affected (0.03 sec)
mysql> GRANT ALL PRIVILEGES on *.* TO 'jimmy'@'%' WITH GRANT OPTION;
Query OK, 0 rows affected (0.01 sec)
mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.00 sec)
mysql> exit
Bye
```

## Git install

```shell
ubuntu@ip-172-31-36-243:~$ sudo apt install git
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
git is already the newest version (1:2.43.0-1ubuntu7).
git set to manually installed.
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
ubuntu@ip-172-31-36-243:~$ git --version
git version 2.43.0
```

## Git configurations

```shell
ubuntu@ip-172-31-36-243:~$ git config --global user.name 'ChenHao'
ubuntu@ip-172-31-36-243:~$ git config --global user.email 'j842671395@gmail.com'
ubuntu@ip-172-31-36-243:~$ git config --list
user.name=ChenHao
user.email=j842671395@gmail.com
```

## Git manipulation

### Git clone from repository

```shell
ubuntu@ip-172-31-36-243:~$ git clone https://github.com/Haohaoscreamandrun/WehelpStage2.git
Cloning into 'WehelpStage2'...
remote: Enumerating objects: 43, done.
remote: Counting objects: 100% (43/43), done.
remote: Compressing objects: 100% (32/32), done.
remote: Total 43 (delta 15), reused 37 (delta 10), pack-reused 0
Receiving objects: 100% (43/43), 217.48 KiB | 8.05 MiB/s, done.
Resolving deltas: 100% (15/15), done.
ubuntu@ip-172-31-36-243:~$ ls
WehelpStage2
ubuntu@ip-172-31-36-243:~$ cd WehelpStage2
ubuntu@ip-172-31-36-243:~/WehelpStage2$ git branch
* main
```

### Switch to the develop branch

```shell
ubuntu@ip-172-31-36-243:~/WehelpStage2$ git checkout develop
branch 'develop' set up to track 'origin/develop'.
Switched to a new branch 'develop'
ubuntu@ip-172-31-36-243:~/WehelpStage2$ git branch
* develop
  main
```

## Run loading script

### Touch .env

```shell
root@ip-172-31-36-243:/home/ubuntu/WehelpStage2# cd taipei-day-trip
root@ip-172-31-36-243:/home/ubuntu/WehelpStage2/taipei-day-trip# nano .env
```

### install packages

```shell
root@ip-172-31-36-243:/home/ubuntu/WehelpStage2# sudo apt install python3-dotenv
root@ip-172-31-36-243:/home/ubuntu/WehelpStage2# sudo apt install python3-mysql.connector # package conflict
root@ip-172-31-36-243:/home/ubuntu/WehelpStage2# pip3 install mysql.connector --break-system-packages
root@ip-172-31-36-243:/home/ubuntu/WehelpStage2# pip3 install mysql-connector-python --upgrade --break-system-packages
```

### Run loading.py

```shell
root@ip-172-31-36-243:/home/ubuntu/WehelpStage2# python3 ./taipei-day-trip/loading.py
...
mysql.connector.errors.NotSupportedError: Authentication plugin 'caching_sha2_password' is not supported
# indicates that the MySQL connector you are using does not support the authentication plugin 'caching_sha2_password'.
# Should install mysql-connector-python
Success! data is loaded.
```

## install packages of app.py

```shell
root@ip-172-31-36-243:/home/ubuntu/WehelpStage2# sudo apt install python3-fastapi
root@ip-172-31-36-243:/home/ubuntu/WehelpStage2# sudo apt install python3-uvicorn
```