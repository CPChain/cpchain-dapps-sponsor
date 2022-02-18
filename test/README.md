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
|3|set name = "test_2"|success|   |
|4|set bytes(name) >100 |fail|   |
|5|set bytes(url) >200 | fail|   |
|6|set bytes(extendedInfo) >200 | fail|   |


## deregister

## modify

