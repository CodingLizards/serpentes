set PATH=C:\Program Files (x86)\Microsoft SDKs\Windows\v7.1A\Bin
makecert -sv localhost.pvk -n "cn=localhost:1337" localhost.cer -b 10/15/2014 -e 01/01/2015 -r
pvk2pfx -pvk localhost.pvk -spc localhost.cer -pfx localhost.pfx