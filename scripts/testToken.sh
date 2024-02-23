grant_type='refresh_token'
body="client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=${grant_type}"
echo ${body}
# curl --request POST --header "application/x-www-form-urlencoded" --data '${body}' https://oauth2.googleapis.com/token
curl --request POST --header "application/x-www-form-urlencoded" --data ${body} https://oauth2.googleapis.com/token
# curl --request POST --header "application/x-www-form-urlencoded" --data 'pwet' https://oauth2.googleapis.com/token