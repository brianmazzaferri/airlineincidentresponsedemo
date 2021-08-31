// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const Datastore = require("nedb"), //(require in the database)
  // Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
  // which doesn't get copied if someone remixes the project.
  db = new Datastore({ filename: ".data/datafile", autoload: true }); //initialize the database

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['channels:join','channels:manage','channels:read','chat:write','chat:write.public','groups:write','links:write','commands', 'pins:write'], //add scopes here
  installationStore: {
    storeInstallation: (installation) => {
      console.log("INSTALLATION:");
      console.log(installation);
      return db.insert(installation, (err, newDoc) => {
        if (err) console.log("There's a problem with the database ", err);
        else if (newDoc) console.log("installation insert completed");
      });
    },
    fetchInstallation: async (InstallQuery) => {
      console.log("FETCH:");
      console.log(InstallQuery);
      let incomingteam = InstallQuery.teamId;
      let result = await queryOne({"team.id":InstallQuery.teamId});
      console.log(result);
      return result;
    },
  },
});

//LISTENERS GO HERE

app.shortcut('createevent', async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: payload.trigger_id,
      // View payload
      view: {
	"title": {
		"type": "plain_text",
		"text": "Create Event",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Create Event",
		"emoji": true
	},
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"callback_id": "createeventmodal",
	"blocks": [
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Weather",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Fuel",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "IT",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Event Type:",
				"emoji": true
			},
			"block_id": "eventtype"
		},
		{
			"type": "input",
			"element": {
				"type": "multi_users_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select users",
					"emoji": true
				},
				"action_id": "multi_users_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Moderators:",
				"emoji": true
			},
			"block_id": "moderators"
		},
		{
			"type": "input",
			"element": {
				"type": "multi_static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "IAH",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "AUS",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "ORD",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "BOS",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "TPA",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "SAT",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Area:",
				"emoji": true
			},
			"block_id": "area"
		},
		{
			"type": "input",
			"element": {
				"type": "multi_static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Weather",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Fuel",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "ORD",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "BOS",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "TPA",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "SAT",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Category:",
				"emoji": true
			},
			"block_id": "category"
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Headline:",
				"emoji": true
			},
			"block_id": "headline"
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"multiline": true,
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Description",
				"emoji": true
			},
			"block_id": "description"
		},
		{
			"type": "divider"
		},
		{
			"type": "input",
			"element": {
				"type": "multi_static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Weather",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "ATC/Meteorology",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "NOC",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Airport Ops",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Audience 1",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Audience 2",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Audience:",
				"emoji": true
			},
			"block_id": "audience"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Suggested Audiences:"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Add All",
					"emoji": true
				},
				"value": "click_me_123",
				"action_id": "button-action"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "ATC/Meteorology"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": ":heavy_plus_sign:",
					"emoji": true
				},
				"value": "click_me_123",
				"action_id": "button-action"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "NOC"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": ":heavy_plus_sign:",
					"emoji": true
				},
				"value": "click_me_123",
				"action_id": "button-action"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Airport Ops"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": ":heavy_plus_sign:",
					"emoji": true
				},
				"value": "click_me_123",
				"action_id": "button-action"
			}
		}
	]
}
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.view('createeventmodal', async ({ ack, body, view, context }) => {
  // Acknowledge the view_submission event
  ack();

	try {
 	
		const result = await app.client.conversations.create({
			token:context.botToken,
			name:"event-iah-thunderstorm-10-14-21"
		});
		
		console.log(result);
		
		const result2 = await app.client.conversations.invite({
			token:context.botToken,
			channel:result.channel.id,
			users:"WTFQ276S3,W012T182X9B,W014Q671LBW"
		});
		
		const result5 = await app.client.conversations.setTopic({
			token:context.botToken,
			channel:result.channel.id,
			topic:"*Moderator:* <@W012T182X9B>  *Severity:* :blue_circle: Sev 2"
		});
		
		const result3 = await app.client.chat.postMessage({
			token:context.botToken,
			channel:result.channel.id,
			text:"New Event Created. Headline:",
			blocks:
				[
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "*Headline:* \nThunderstorms have been moving slowly through the N90 airspace, blocking departure"
						}
					},
					{
						"type": "actions",
						"elements": [
							{
								"type": "button",
								"text": {
									"type": "plain_text",
									"text": ":mega: Modify Audience",
									"emoji": true
								},
								"value": "click_me_123",
								"action_id": "modifyaudience"
							},
							{
								"type": "button",
								"text": {
									"type": "plain_text",
									"text": ":earth_asia: Live Weather",
									"emoji": true
								},
								"value": "click_me_123",
								"action_id": "viewliveweather"
							},
							{
								"type": "button",
								"text": {
									"type": "plain_text",
									"text": ":united: Open UnitedView",
									"emoji": true
								},
								"value": "click_me_123",
								"action_id": "openunitedview"
							}
						]
					}
				]
		});
		
		const result4 = await app.client.pins.add({
			token:context.botToken,
			channel:result.channel.id,
			timestamp:result3.ts
		});
		
		const result6 = await app.client.chat.postMessage({
			token:context.botToken,
			channel:result.channel.id,
			thread_ts:result3.ts,
			text:"*Description:*\nThunderstorms have been moving slowly through the N90 airspace, blocking departure and arrival routes to the west and south of EWR, causing gate returns for re-routes as well as diversions due to arrival holding or lengthy weather deviations.\nEWR was under a modified 2nd tier ground stop from 1454 until 1601.3 arrivals diverted to IAD due to weather"
		});		

  	} 
	catch (error) {
		console.error(error);
	}
	
	
/*  // Do whatever you want with the input data - here we're saving it to a DB then sending the user a verifcation of their submission

  // Assume there's an input block with `test_input` as the block_id and `dreamy_input` as the action_id
  const val = view['state']['values']['test_input']['dreamy_input'];
  const user = body['user']['id'];
  
  // You'll probably want to store these values somewhere
  console.log(val);
  console.log(user); */

});

app.action('viewliveweather', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
	"title": {
		"type": "plain_text",
		"text": "Live Weather",
		"emoji": true
	},
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Close",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Open in Thor",
		"emoji": true
	},
	"callback_id": "createeventmodal",
	"blocks": [
			{
				"type": "image",
				"image_url": "https://fixthephoto.com/images/content/weather-radar-pro-weather-apps-for-windows-10-interface.png",
				"alt_text": "inspiration"
			}
		]
	}
    });
  }
	catch (error) {
	console.error(error);
	}
});

//BOILERPLATE BELOW HERE

//look up any one document from a query string
function queryOne(query) {
  return new Promise((resolve, reject) => {
    db.findOne(query, (err, docs) => {
      if (err) console.log("There's a problem with the database: ", err);
      else if (docs) console.log(query + " queryOne run successfully.");
      resolve(docs);
    });
  });
}

//print the whole database (for testing)
function printDatabase() {
  db.find({}, (err, data) => {
    if (err) console.log("There's a problem with the database: ", err);
    else if (data) console.log(data);
  });
}

//clear out the database
function clearDatabase(team,channel) {
  db.remove({team:team, channel:channel}, { multi: true }, function(err) {
    if (err) console.log("There's a problem with the database: ", err);
    else console.log("database cleared");
  });
}
(async () => {
  // boilerplate to start the app
  await app.start(process.env.PORT || 3000);
  //printDatabase();
  console.log("⚡️ Bolt app is running!");
})();
