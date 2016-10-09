#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Copyright (c) 2014,掌阅科技
All rights reserved.

摘    要: index.py
创 建 者: zhuangshixiong
创建日期: 2015-10-09
"""
from handler.bases import CommonBaseHandler
from handler.bases import ArgsMap
from lib import route
from urllib import quote
from urllib2 import urlopen
import json


@route(r'/')
class IndexHandler(CommonBaseHandler):

    '''配置管理系统页面入口
    '''

    def response(self):
        if not self.current_user:
            url = 'http://passport.msxf.louat/auth/validate?projectCode=' + quote('message_boss') + '&projectServer=' + quote('http://127.0.0.1:8080') + '&fromPath=' + quote('/')
            return self.redirect(url.encode('utf-8'))
        return self.render('index.html')

@route(r'/passport/authToken')
class PassPortHandler(CommonBaseHandler):
    '''search,搜索
    '''
    args_list = [
        ArgsMap('token', required=True),
        ArgsMap('fromPath', default='/'),
    ]

    def response(self):
        self.set_secure_cookie('token', self.token)
        url = 'http://passport.msxf.louat/api/findAdminByToken?token='+quote(self.token)+'&projectKey='+ quote('s6ugypfj')
        resp = json.load(urlopen(url))
        # self.set_secure_cookie('email', (resp['email']).encode('utf-8'))
        # self.set_secure_cookie('name', (resp['name']).encode('utf-8'))
        self.set_cookie('email', (resp['email']).encode('utf-8'))
        self.set_cookie('name', (resp['name']).encode('utf-8'))
        request = self.request
        self.redirect(request.protocol + '://' + request.host + self.fromPath)

@route(r'/auth/index/main', '首页')
class IndexMainHandler(CommonBaseHandler):

    '''首页
    '''

    def response(self):
        self.finish()
