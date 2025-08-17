import { webResult } from '../net.js'
export function listMember() {
  return fetch("/api/member/list?enabled=true", {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  }).then((res) => {
    return res.json()
  })
}

export function listAccount (memberId,platformId) {
  let query =[];
  if (platformId) {
    query.push('platformId=' + platformId);
  }
  if (memberId) {
    query.push('memberId=' + memberId);
  }
  query =  query.join("&");
  return fetch('/api/finance/account/list?' + query)
    .then((res) => { return res.json() })
    .then(webResult)
}

export function listPlatform () {
  return fetch('/api/finance/platform/list', {
    headers: {
      'X-Requested-With': 'fetch',
    },
  })
    .then((res) => { return res.json() })
    .then(webResult)
}
