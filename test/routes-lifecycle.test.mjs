/**
 * 路由生命周期回归测试。
 *
 * 背景（2026-11-03 线上 503）：`registerRoutes` 最初在 `ctx.effect` 里调用
 * `webServer.register(...)` 却**没有把 disposer 交回去**。插件在 install / 热重载时
 * 会重新 apply：旧路由留在宿主上继续指向已释放的 ctx，新 apply 又在同路径上撞
 * duplicate 而中断 —— 结果是路由还在、工具没了、每次请求都 503。
 *
 * 这两个用例锁住两件事：
 *   1. effect 必须拿到一个可调用的 disposer；
 *   2. dispose 之后重新 apply 不留下重复路由、也不抛 duplicate。
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { registerRoutes } = require('../src/host/routes.js')

/** 最小 ctx：webServer.register 返回 disposer，同路径重复注册抛错。 */
function makeCtx(routes) {
  const cleanups = []
  const ctx = {
    webServer: {
      register(spec) {
        const clash = routes.some((route) => route.kind === spec.kind && route.path === spec.path)
        if (clash) throw new Error(`duplicate route ${spec.kind} ${spec.path}`)
        routes.push(spec)
        return () => {
          const index = routes.indexOf(spec)
          if (index >= 0) routes.splice(index, 1)
        }
      },
    },
    connection: { requestRejection: () => undefined },
    effect(fn) {
      cleanups.push(fn())
    },
  }
  return { ctx, cleanups }
}

test('路由 effect 必须把 disposer 交回', () => {
  const routes = []
  const { ctx, cleanups } = makeCtx(routes)
  registerRoutes(ctx, {})

  assert.equal(routes.length, 1, '注册了一条 prefix 路由')
  assert.equal(typeof cleanups[0], 'function', 'ctx.effect 的回调返回了 disposer')
})

test('dispose 后重新 apply：不残留旧路由，也不抛 duplicate', () => {
  const routes = []
  const first = makeCtx(routes)
  registerRoutes(first.ctx, {})
  assert.equal(routes.length, 1)

  // 模拟插件被卸载：effect 的清理函数应当把路由摘掉。
  for (const cleanup of first.cleanups) cleanup()
  assert.equal(routes.length, 0, 'dispose 后路由被移除')

  // 模拟插件重新安装：同一路径还能再注册。
  const second = makeCtx(routes)
  assert.doesNotThrow(() => registerRoutes(second.ctx, {}))
  assert.equal(routes.length, 1, '重新 apply 后只有一条路由')
})
