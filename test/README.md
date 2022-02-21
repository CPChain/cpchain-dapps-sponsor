# Sponsor Contract Test

## register
+ msg.sender = accounts[1]
+ name = "test_1"
+ contractAddr = accounts[2]
+ url = "www.test.1.com"
+ receiverAddr = account[3]
+ extendedInfo = "{}"


|#|Name|Expect|Done|
|---|----|------|---|
|1|params as default| success |Done|
|2|set name = "test_1" again|fail|Done|
|3|set name = "test_2"|success|Done|
|4|set bytes(name) >100 |fail|Done|
|5|set bytes(url) >200 | fail|Done|
|6|set bytes(extendedInfo) >200 |fail|Done|


## deregister

register some dapps at first

|#|Name|Expect|Done|
|---|----|------|---|
|1|id = 1, Dapps[1] is exist, msg.sender = Dapps[1].registrant|success|Done|
|2|id = 2, Dapps[2] is exist, msg.sender != Dapps[2].registrant|fail|Done|
|3|id = 3, Dapps[3] is deregistered|fail|Done|
|4|id = 4, Dapps[4] is not exist |fail|Done|


## modify

register some dapps at first

+ msg.sender = accounts[1]
+ name = "test_2"
+ contractAddr = accounts[2]
+ url = "www.test.2.com"
+ receiverAddr = account[3]
+ extendedInfo = "{}"


|#|Name|Expect|Done|
|---|----|------|---|
|1|params as default|success|Done|
|2|dapp is not exist|fail|Done|
|3|dapp is deregisted|fail|Done|
|4|sender != Dapps[id].registrant|fail|Done|
|5|name is already used |fail|Done|
|6|length of name,url,extendedinfo greater than max |fail|Done|

## takedown

register some dapps at first

|#|Name|Expect|Done|
|---|----|------|---|
|1|id = 1, Dapps[1] is exist, msg.sender = owner|success|Done|
|2|id = 2, Dapps[2] is exist, msg.sender != owner|fail|Done|
|3|id = 3, Dapps[3] is deregistered|fail|Done|
|4|id = 4, Dapps[4] is not exist |fail|Done|



## sponsor

register some dapps at first

|#|Name|Expect|Done|
|---|----|------|---|
|1|Dapps[id] is exist, amount = 10 ether|success|Done|
|2|Dapps[id] is not exist|fail|Done|
|3|Dapps[id] is deregistered|fail|Done|
|4|amount < 1 ether|fail|Done|
|5|amount > maxDonationLimit|fail|Done|

## change params

