#!/bin/bash
WORK_PATH='/usr/projects/blog'
cd $WORK_PATH
echo '清理代码'
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
git pull origin master
echo "安装依赖"
npm install
echo "打包最新代码"
npm run build
echo "开始构建镜像"
docker build -t blog:1.0 .
echo '删除旧容器'
docker stop blog
docker rm blog
echo '启动新容器'
docker run -p -d 80:80 --name blog blog