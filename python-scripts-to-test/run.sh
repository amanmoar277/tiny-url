#To run in sequence

if [ -d "./python-scripts-to-test/generated-data" ] 
then
    echo "generate-data directory already exist, skipping creation" 
else
    echo "Creating generate-data directory, as it is not present"
    mkdir ./python-scripts-to-test/generated-data
fi

python3 ./python-scripts-to-test/create-test-data_as_json.py 10 https://www.google.com; python3 ./python-scripts-to-test/get_encoding.py; python3 ./python-scripts-to-test/get_decoding.py
#python3 create-test-data_as_json.py 10 https://www.google.com && python3 get_encoding.py && python3 get_decoding.py

#To run parallely
#python3 create-test-data_as_json.py 10 https://www.google.com & python3 get_encoding.py & python3 get_decoding.py