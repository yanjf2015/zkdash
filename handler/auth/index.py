#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Copyright (c) 2014,掌阅科技
All rights reserved.

摘    要: index.py
创 建 者: zhuangshixiong
创建日期: 2015-10-09
"""
import json

from lib import route
from urllib import quote
from urllib import unquote
from urllib2 import urlopen

from handler.bases import CommonBaseHandler
from handler.bases import ArgsMap
from conf.settings import PASSPORT


@route(r'/')
class IndexHandler(CommonBaseHandler):

    '''配置管理系统页面入口
    '''

    def response(self):
        if not self.current_user:
            request = self.request
            url = PASSPORT['publicUrl'] + 'auth/validate?projectCode=' + quote(PASSPORT['projectCode']) + '&projectServer=' + quote(request.protocol + '://' +request.host) + '&fromPath=' + quote(request.path)
            return self.redirect(url.encode('utf-8'))
        return self.render('index.html',
                           current_user=self.current_user)

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
        url = PASSPORT['publicUrl']  + 'api/findAdminByToken?token='+quote(self.token)+'&projectKey='+ quote(PASSPORT['projectKey'])
        resp = json.load(urlopen(url))
        self.set_secure_cookie('email', quote(resp['email'].encode('utf-8')))
        self.set_secure_cookie('name', quote(resp['name'].encode('utf-8')))
        # self.set_cookie('email', (resp['email']).encode('utf-8'))
        # self.set_cookie('name', (resp['name']).encode('utf-8'))
        redirecturl = self.request.protocol + '://' + self.request.host + unquote(self.fromPath)
        self.redirect(redirecturl.encode('utf-8'))

@route(r'/passport/logout')
class PassportLogout(CommonBaseHandler):
    def response(self):
        self.clear_cookie('token')
        self.clear_cookie('email')
        self.clear_cookie('name')
        self.clear_cookie('current_user')
        request = self.request
        url = PASSPORT['publicUrl'] + 'auth/invalidate?projectCode=' + quote(PASSPORT['projectCode']) + '&projectServer=' + quote(request.protocol + '://' +request.host) + '&fromPath=' + quote(request.path)
        resp = urlopen(url)
        # self.response().write(resp.read())
        self.redirect(resp.url)

@route(r'/passport/clearCookie')
class PassportClearCookie(CommonBaseHandler):
    '''clear cookie
    '''
    args_list = [
        ArgsMap('cookieName', default='token'),
    ]

    def response(self):
        self.clear_cookie('token')
        self.clear_cookie(self.cookieName)
        self.clear_cookie('email')
        self.clear_cookie('name')
        self.clear_cookie('current_user')
        # return

@route(r'/auth/index/main', '首页')
class IndexMainHandler(CommonBaseHandler):

    '''首页
    '''

    def response(self):
        self.finish()
