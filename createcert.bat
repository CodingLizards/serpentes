set PATH=C:\Program Files (x86)\Microsoft SDKs\Windows\v7.1A\Binmakecert -sv server.pvk -n "cn=localhost:1337" server.cer -b 10/15/2014 -e 01/01/2020 -r
makecert -sv server.pvk -n "cn=localhost:1337" server.cer -b 10/15/2014 -e 01/01/2020 -r
pvk2pfx -pvk server.pvk -spc server.cer -pfx server.p12