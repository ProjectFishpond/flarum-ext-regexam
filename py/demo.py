#! /usr/bin/env python3

import sys
import hmac

def main(arg):
    if len(arg) != 2:
#        print('Status: 400 Bad Request\nContent-Type: text/plain\n')
#        print('Bad request')
        print(400)
        sys.exit(0)
    args = (arg[0][:8],arg[0][8:])
#    secKey = 'Saccharomycescerevisiae'
    secKey = arg[1]
    stdin = open(sys.argv[0].replace('demo.py','uid.log'),'r')
    for item in stdin:
        if item.strip() == args[0]:
            print(401)
            sys.exit(0)
    stdin.close()
    if hmac.compare_digest(hmac.new(args[0].encode('UTF-8'),secKey.encode('UTF-8'),'sha512').hexdigest(),args[1]):
#        print('Content-Type: text/plain\n')
#        print('Success')
        stdin = open(sys.argv[0].replace('demo.py','uid.log'),'a')
        stdin.write(args[0]+'\n')
        stdin.close()
        print(200)
        sys.exit(0)
#    print('Status: 401 Not Authorized\nContent-Type: text/plain\n')
#    print('Not authorized')
    print(401)

if __name__ == '__main__':
    main(sys.argv[1:])
