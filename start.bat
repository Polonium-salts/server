@echo off
title CerealsHub Server

echo 开始构建CerealsHub后端服务...

REM 构建项目
call mvn clean package

REM 检查构建是否成功
if %ERRORLEVEL% EQU 0 (
    echo 构建成功，正在启动服务...
    java -jar target\*.jar
) else (
    echo 构建失败，请检查错误信息
    pause
    exit /b 1
)