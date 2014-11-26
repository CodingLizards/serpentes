git init .
git add .
git commit -m "this is to prevent the install.bat from delete"
git remote add -f -t master -m master origin https://github.com/CodingLizards/serpentes.git
git checkout master
git pull
call npm install
call npm install -g nodemon
start http://localhost:1337/
set PORT=1337
node install.js
call start.bat