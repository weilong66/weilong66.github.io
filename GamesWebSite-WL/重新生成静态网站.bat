@echo off
REM 启动 Hugo 服务器，默认情况下会在 http://localhost:1313/ 上提供服务
echo 正在执行 Hugo 重新生成网站...

hugo

echo 静态网页生成完成，请自行到 public 下查看
REM 脚本结束后暂停窗口，以便可以看到任何输出信息
pause