#!/bin/bash

# CerealsHub Server启动脚本

echo "开始构建CerealsHub后端服务..."

# 构建项目
mvn clean package

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "构建成功，正在启动服务..."
    java -jar target/*.jar
else
    echo "构建失败，请检查错误信息"
    exit 1
fi