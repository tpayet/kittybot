/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: erwanleb <erwanleb@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/23 11:16:37 by erwanleb          #+#    #+#             */
/*   Updated: 2018/02/23 11:33:46 by erwanleboucher   ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { RtmClient, CLIENT_EVENTS, RTM_EVENTS } = require('@slack/client');
const Slack = require('slack');
const token = process.env.SLACK_API_TOKEN;

// Cache of data
const appData = {};
const bot = new Slack({ token });
// Initialize the RTM client with the recommended settings. Using the defaults for these
// settings is deprecated.
const rtm = new RtmClient(token, {
    dataStore: false,
    useRtmConnect: true
});

const getUsername = user => {
    return bot.users.info({
        user: user
    });
};

const sendReaction = (text, channel, ts) => {
    bot.reactions.add({
        timestamp: ts,
        channel: channel,
        name: text
    });
};

// Read messages
rtm.on(RTM_EVENTS.MESSAGE, async message => {
    let username = await getUsername(message.user);
    username = username['user']['name'];
    console.log(`${username}: ${message.text}`);
    if (username === 'saf') sendReaction('kitty', message.channel, message.ts);
    if (/(\b|^)(php|Ruby|RoR|mongo|mongodb)(\b|$)/i.test(message.text))
        sendReaction('poop', message.channel, message.ts);
});

// Start the connecting process
rtm.start();
