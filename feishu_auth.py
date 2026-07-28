"""
飞书 OAuth 登录
"""
import os
import requests
from flask import Blueprint, redirect, request, session

auth_bp = Blueprint('auth', __name__)

FEISHU_APP_ID = os.getenv('FEISHU_APP_ID', '')
FEISHU_APP_SECRET = os.getenv('FEISHU_APP_SECRET', '')
FEISHU_REDIRECT_URI = os.getenv('FEISHU_REDIRECT_URI', 'http://localhost:5000/auth/callback')


@auth_bp.route('/auth/login')
def login():
    """跳转飞书 OAuth 授权页"""
    url = (
        f"https://open.feishu.cn/open-apis/authen/v1/authorize"
        f"?app_id={FEISHU_APP_ID}"
        f"&redirect_uri={FEISHU_REDIRECT_URI}"
        f"&response_type=code"
    )
    return redirect(url)


@auth_bp.route('/auth/callback')
def callback():
    """飞书 OAuth 回调，获取用户信息"""
    code = request.args.get('code')
    if not code:
        return {"code": 400, "msg": "缺少授权码"}, 400

    # 用 code 换取 user_access_token
    token_resp = requests.post(
        "https://open.feishu.cn/open-apis/authen/v1/oidc/access_token",
        headers={"Content-Type": "application/json"},
        json={
            "grant_type": "authorization_code",
            "code": code,
            "app_id": FEISHU_APP_ID,
            "app_secret": FEISHU_APP_SECRET
        }
    )

    if token_resp.status_code != 200:
        return {"code": 500, "msg": "获取 token 失败"}, 500

    token_data = token_resp.json().get('data', {})
    user_access_token = token_data.get('access_token')

    # 获取用户信息
    user_resp = requests.get(
        "https://open.feishu.cn/open-apis/authen/v1/user_info",
        headers={"Authorization": f"Bearer {user_access_token}"}
    )

    if user_resp.status_code != 200:
        return {"code": 500, "msg": "获取用户信息失败"}, 500

    user_info = user_resp.json().get('data', {})

    # 存入 session
    session['user'] = {
        'feishu_id': user_info.get('open_id'),
        'nickname': user_info.get('name'),
        'avatar_url': user_info.get('avatar_url'),
    }

    # 重定向到前端首页
    return redirect('/')
