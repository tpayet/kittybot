require 'slack-ruby-client'
require 'byebug'

def define_user(users_list, u_id)
  users_list[u_id]
end

# Configure slack client for connection
Slack.configure do |config|
  config.token = ENV['SLACK_API_TOKEN']
end

# Use web client to get list of users, web_client will be used to send reactions
web_client = Slack::Web::Client.new
list_users = web_client.users_list
users_by_id = list_users.members.map { |member| [member.id, member.name] }.to_h

# Real time client handles real time activity
realtime_client = Slack::RealTime::Client.new

realtime_client.on :message do |data|
  user = define_user(users_by_id, data.user)
  case user
  when 'saf'
    web_client.reactions_add name: 'kitty', timestamp: data.ts, channel: data.channel
  when 'tpayet'
    p data.text
  end
end

realtime_client.start!
