git init .
git remote add -f -t master -m master origin https://github.com/CodingLizards/serpentes.git
git checkout master
call npm install
call npm install -g nodemon
start http://localhost:1337/
node install.js PORT=1337
call start.bat