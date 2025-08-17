import net, { webResult } from '@/net'
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
export function pageFinances(page,itemsPerPage,query){
  return fetch(
    '/api/finance/finances', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json;',
        'X-Requested-With': 'fetch',
      },
      body: JSON.stringify({
        currentPage: page,
        pageSize: itemsPerPage,
        query: query
      }),
    },
  )
    .then((res) => {
      return res.json()
    })
    .then(webResult)
}
export function financeLastDetail(platformId,amountType,accountId){
  return fetch('/api/finance/finance/last/detail?accountId=' + accountId + '&platformId=' + platformId + '&amountType=' + amountType)
    .then(function (res) {
      return res.json()
    }).then(function (json) {
      return json.data
    });
}
export function financeAnalysis(memberId,platformId,accountId){
  let url = "/api/finance/analysis?days=20";
  if (memberId) {
    url = url + "&memberId=" + memberId;
  }
  if (platformId) {
    url = url + "&platformId=" + platformId;
  }
  if (accountId) {
    url = url + "&accountId=" + accountId;
  }
  return fetch(url, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then(function (resp) {
      return resp.json();
    })
    .then(net.webResult)
}
