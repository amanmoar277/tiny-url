#To run in sequence
python3 create-test-data_as_json.py 10 https://www.google.com; python3 get_encoding.py; python3 get_decoding.py
#python3 create-test-data_as_json.py 10 https://www.google.com && python3 get_encoding.py && python3 get_decoding.py

#To run parallely
#python3 create-test-data_as_json.py 10 https://www.google.com & python3 get_encoding.py & python3 get_decoding.py