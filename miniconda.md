# Miniconda as virtual environment managing tool

## Reference

1. [Miniconda installation](https://docs.anaconda.com/free/miniconda/index.html)
2. [用conda建立及管理python虛擬環境](https://medium.com/python4u/%E7%94%A8conda%E5%BB%BA%E7%AB%8B%E5%8F%8A%E7%AE%A1%E7%90%86python%E8%99%9B%E6%93%AC%E7%92%B0%E5%A2%83-b61fd2a76566)

> minianaconda只管理python package環境，mysql, git還是用通用環境裝

## Install miniconda

```shell
ubuntu@ip-172-31-23-171:~$ mkdir ~/miniconda3
# download and specify the name of file
ubuntu@ip-172-31-23-171:~$ wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
# unzip miniconda.sh
ubuntu@ip-172-31-23-171:~$ bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
## bash: This invokes the Bash shell to execute the script.
## ~/miniconda3/miniconda.sh: This is the path to the Miniconda installation script. The tilde ~ represents the home directory of the current user.
## -b: This stands for "batch mode" and runs the installation without prompting the user for input. It's useful for automated installations.
## -u: This option updates an existing installation if Miniconda is already installed in the specified directory.
## -p ~/miniconda3: This specifies the installation prefix or the directory where Miniconda should be installed or updated. In this case, it’s set to ~/miniconda3.

# remove .sh
ubuntu@ip-172-31-23-171:~$ rm -rf ~/miniconda3/miniconda.sh
## -r: This stands for "recursive" and allows the command to remove directories and their contents recursively.
## -f: This stands for "force" and forces the removal without prompting for confirmation, even if the files are write-protected.

# init conda with bash
ubuntu@ip-172-31-23-171:~$ ~/miniconda3/bin/conda init bash
```

## Check if conda installed successfully

```shell
(base) ubuntu@ip-172-31-23-171:~$ conda -V
conda 24.4.0
# 你可以輸入下面命令看目前系統已經安裝幾個虛擬環境。
(base) ubuntu@ip-172-31-23-171:~$ conda env list
conda environments:
base                  *  /home/ubuntu/miniconda3
# Check python version
(base) ubuntu@ip-172-31-23-171:~$ python --version
Python 3.12.3 
```

## Create your own virtual env

```shell
# create VE
(base) ubuntu@ip-172-31-23-171:~$ conda create --name taipeiAttractions python=3.12.3
(base) ubuntu@ip-172-31-23-171:~$ conda env list
conda environments:
base                  *  /home/ubuntu/miniconda3
taipeiAttractions        /home/ubuntu/miniconda3/envs/taipeiAttractions

# Activate VE
(base) ubuntu@ip-172-31-23-171:~$ source activate taipeiAttractions
(taipeiAttractions) ubuntu@ip-172-31-23-171:~$ 
```

## install package in conda env

```shell
(taipeiAttractions) ubuntu@ip-172-31-23-171:~$ pip install mysql-connector-python
(taipeiAttractions) ubuntu@ip-172-31-23-171:~$ pip install python-dotenv
(taipeiAttractions) ubuntu@ip-172-31-23-171:~$ pip install fastapi
(taipeiAttractions) ubuntu@ip-172-31-23-171:~$ pip install uvicorn
(taipeiAttractions) ubuntu@ip-172-31-23-171:~$ pip install pyjwt
```
