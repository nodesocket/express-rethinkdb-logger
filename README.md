# express-rethinkdb-logger
An example express web server with middleware that logs all requests to RethinkDB

## Example Document

    {
        "date":  "2015-06-02T23:55:14.276Z" ,
        "http_version":  "1.1" ,
        "id":  "66946554-0482-4dfd-9ae7-04bb41cd3a3f" ,
        "method":  "GET" ,
        "remote_addr":  "::1" ,
        "remote_user":  "-" ,
        "response_time": 13.236 ,
        "status": 200 ,
        "url":  "/" ,
        "user_agent":  "curl/7.37.1"
    }

## Benchmark/Performance

#### Using apache bench. Stable **1,434 requests per second**, no failed requests.

    Server Software:
    Server Hostname:        localhost
    Server Port:            3000

    Document Path:          /
    Document Length:        48 bytes

    Concurrency Level:      1
    Time taken for tests:   139.439 seconds
    Complete requests:      200000
    Failed requests:        0
    Keep-Alive requests:    200000
    Total transferred:      58200000 bytes
    HTML transferred:       9600000 bytes
    Requests per second:    1434.32 [#/sec] (mean)
    Time per request:       0.697 [ms] (mean)
    Time per request:       0.697 [ms] (mean, across all concurrent requests)
    Transfer rate:          407.61 [Kbytes/sec] received

    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0    0   0.0      0       0
    Processing:     0    1   0.8      1      56
    Waiting:        0    1   0.8      1      56
    Total:          0    1   0.8      1      56

    Percentage of the requests served within a certain time (ms)
      50%      1
      66%      1
      75%      1
      80%      1
      90%      1
      95%      1
      98%      1
      99%      2
     100%     56 (longest request)
