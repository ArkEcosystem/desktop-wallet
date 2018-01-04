/********************************************************************************
*   Ledger Node JS API
*   (c) 2016-2017 Ledger
*
*  Licensed under the Apache License, Version 2.0 (the "License")
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
********************************************************************************/

'use strict'

const Q = require('q')

const LedgerUtils = {}

LedgerUtils.splitPath = function (path) {
  const result = []
  const components = path.split('/')
  components.forEach((element, index) => {
    let number = parseInt(element, 10)
    if (isNaN(number)) {
      return
    }
    if ((element.length > 1) && (element[element.length - 1] === "'")) {
      number += 0x80000000
    }
    result.push(number)
  })
  return result
}

LedgerUtils.foreach = function (arr, callback) {
  const deferred = Q.defer()
  const iterate = function (index, array, result) {
    if (index >= array.length) {
      deferred.resolve(result)
      return
    }
    callback(array[index], index).then((res) => {
      result.push(res)
      iterate(index + 1, array, result)
    }).fail((ex) => {
      deferred.reject(ex)
    }).done()
  }
  iterate(0, arr, [])
  return deferred.promise
}

LedgerUtils.doIf = function (condition, callback) {
  const deferred = Q.defer()
  if (condition) {
    deferred.resolve(callback())
  } else {
    deferred.resolve()
  }
  return deferred.promise
}

LedgerUtils.asyncWhile = function (condition, callback) {
  const deferred = Q.defer()
  const iterate = function (result) {
    if (!condition()) {
      deferred.resolve(result)
      return
    }
    callback().then((res) => {
      result.push(res)
      iterate(result)
    }).fail((ex) => deferred.reject(ex))
      .done()
  }
  iterate([])
  return deferred.promise
}

module.exports = LedgerUtils
