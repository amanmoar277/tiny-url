import sys
import datetime
import json

def main():
    print('Starting script from file' + sys.argv[0])
    n = sys.argv[1]
    url = sys.argv[2]
    print(n, url)
    urls = []
    for i in range(1, int(n) + 1):
        newURL = url + '/' + str(i)
        urlObj = {
            "url": newURL,
        }
        urls.append(urlObj)

    print("start writing now->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    with open('./generated-data/raw_urls_payload.json', 'w') as outfile:
        json.dump({"values": urls}, outfile, indent=2)

    print("End")


if __name__ == '__main__':
    start_time = datetime.datetime.now()
    print(start_time)
    main()
    run_time = datetime.datetime.now() - start_time
    print(run_time)