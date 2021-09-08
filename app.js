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
  scopes: ['channels:join','channels:manage','workflow.steps:execute','channels:read','chat:write','chat:write.public','groups:write','links:write','commands', 'pins:write','admin.conversations:write'], //add scopes here
  installationStore: {
    storeInstallation: (installation) => {
	    
	if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {       
	      console.log("ENTERPRISE INSTALLATION:");
	      console.log(installation);
	      return db.insert(installation, (err, newDoc) => {
		if (err) console.log("There's a problem with the database ", err);
		else if (newDoc) console.log("enterprise installation insert completed");
	      });
	}	
	    
	if (installation.team !== undefined) {       
	      console.log("SINGLE TEAM INSTALLATION:");
	      console.log(installation);
	      return db.insert(installation, (err, newDoc) => {
		if (err) console.log("There's a problem with the database ", err);
		else if (newDoc) console.log("single team installation insert completed");
	      });
	}	
    },
	  
    fetchInstallation: async (installQuery) => {
	    
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
	      console.log("ENTERPRISE FETCH:");
	      console.log(installQuery);
	      let incomingteam = installQuery.teamId;
	      let result = await queryOne({"enterprise.id":installQuery.enterpriseId});
	      console.log(result);
	      return result;
      }

      if (installQuery.teamId !== undefined) {
	      console.log("SINGLE TEAM FETCH:");
	      console.log(installQuery);
	      let incomingteam = installQuery.teamId;
	      let result = await queryOne({"team.id":installQuery.teamId});
	      console.log(result);
	      return result;
      }	    
    },
  },
});

//LISTENERS GO HERE

app.shortcut('createevent', async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  try {
	  
    	let result11 = await queryOne({"channel.name":"event-iah-thunderstorm-10-14-21"});
	  
	 if (result11){
		const result12 = await app.client.admin.conversations.delete({
	  		token:process.env.USER_TOKEN,
			channel_id:result11.channel.id
	  	});
	 
	  
	  	const deleteIt = await deleteRecords({"channel.name":"event-iah-thunderstorm-10-14-21"});
	 }
	  
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
				"action_id": "addATC"
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

app.action('addATC', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  try {
    const result = await app.client.views.update({
      token: context.botToken,
      view_id: body.view.id,
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
				"initial_options": [
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
					}
				],
				"action_id": "static_select-actionnu"
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
				"text": "FOS"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": ":heavy_plus_sign:",
					"emoji": true
				},
				"value": "click_me_123",
				"action_id": "addATC"
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
			name:"event-iah-thunderstorm-10-14-21",
			team_id:"T02B3EN7PHA"
		});
		
		const channelID = result.channel.id;
		
		console.log(result);
		
		const result2 = await app.client.conversations.invite({
			token:context.botToken,
			channel:result.channel.id,
			users:"WTFQ276S3,W012T182X9B,W014Q671LBW, W011H7YMTJ6, W012Z79QQ5N,WTDERRE5A,WTFQ1FNS3,W0183CDTA2E,WTG4X0RHC,WTG4X9MN2,WTG4WTYFQ,WTDERPW1J,WTDUQJWUV"
		});
		
		const result5 = await app.client.conversations.setTopic({
			token:context.botToken,
			channel:result.channel.id,
			topic:"*Moderator:* <@W012T182X9B>  *Severity:* :blue_circle: Sev 2"
		});
		
		db.insert(result, (err, newDoc) => {
		      if (err) console.error("There's a problem with the database ", err);
		      else if (newDoc) console.log("result insert completed");
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
									"text": ":busts_in_silhouette: Modify Audience",
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
									"text": ":red_circle: Change Severity",
									"emoji": true
								},
								"value": "click_me_123",
								"action_id": "escalateevent"
							},
							{
								"type": "button",
								"text": {
									"type": "plain_text",
									"text": ":mega: Event Update",
									"emoji": true
								},
								"value": "click_me_123",
								"action_id": "updateevent"
							},
							{
								"type": "button",
								"text": {
									"type": "plain_text",
									"text": ":white_check_mark: Close Event",
									"emoji": true
								},
								"value": "click_me_123",
								"action_id": "closeeevent"
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
		
		let blocks = [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": ":wind_blowing_face:  Daily Weather Event Briefing  :wind_blowing_face:"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": " :chart_with_upwards_trend: | *SUMMARY METRICS* | :chart_with_downwards_trend:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*21* New Weather Events in the past 24 hours\n:large_green_circle: *below* average (31 per day)\n"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "View Dashboard",
					"emoji": true
				}
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Events by Severity Level*\n:red_circle: *Sev 1:* 0\n:blue_circle: *Sev 2:* 6\n:white_circle: *Sev 3:* 15"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":firefighter: |   *ACTIVE EVENTS*  | :firefighter:"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "View Current Active Events",
					"emoji": true
				},
				"action_id": "viewactiveevents"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "`Sev 1` :red_circle:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "no active events :+1:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "`Sev 2` :blue_circle:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "ORD Thunderstorms: <https://www.slack.com|#event-ord-thunderstorms>\nTropical Storm Henri: <https://www.slack.com|#event-tropical-storm-henri>\nCalifornia Wildfires: <https://www.slack.com|#event-california-wildfires>"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "`Sev 3` :white_circle:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Hail Over Hawaii: <https://www.slack.com|#event-hawaiian-hailstorm>\nGreased Lightning: <https://www.slack.com|#event-greased-lightning>"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":white_check_mark: |   *RESOLVED EVENTS (Past 24 hrs)*  | :white_check_mark: "
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Scranton Stormclouds: <https://www.slack.com|#event-scranton-stormclouds>\nAUS Freezing Rain: <https://www.slack.com|#event-aus-freezing-rain>\nMeteor Shower: <https://www.slack.com|#event-meteor-shower>\nSRQ Tornado: <https://www.slack.com|#event-srq-tornado>"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":sun_small_cloud: |   *CURRENT CONDITIONS*  | :sun_small_cloud: "
			}
		},
		{
			"type": "image",
			"image_url": "https://s.w-x.co/staticmaps/WEB_Current_Weather_Map_1280x720.jpg?v=ap&w=1280&h=720&api=7db9fe61-7414-47b5-9871-e17d87b8b6a0",
			"alt_text": "inspiration"
		}
	]
		
		const result10 = await app.client.chat.postMessage({
			token:context.botToken,
			channel:"C02B9VBSFHP",
			blocks: blocks
		});
		
		let message = ":iah: *A New IAH Event* has been created\n*Headline:* Thunderstorms have been moving slowly through the N90 airspace, blocking departure\n*Severity:* Sev 2 :blue_circle:\n*Channel:* <#" + channelID + ">"
		
		const result8 = await app.client.chat.postMessage({
			token:context.botToken,
			channel:"C02AXBAGSDQ",
			text: message
		});
		
		const result9 = await app.client.admin.conversations.setConversationPrefs({
			token:process.env.USER_TOKEN,
			channel_id:channelID,
			prefs: "{'who_can_post':'type:admin','can_thread':'type:ra'}"
		});	
		
		message = ":thunder_cloud_and_rain: *A New Weather Event* has been created\n*Headline:* Thunderstorms have been moving slowly through the N90 airspace, blocking departure\n*Severity:* Sev 2 :blue_circle:\n*Channel:* <#" + channelID + ">"
		
		const result7 = await app.client.chat.postMessage({
			token:context.botToken,
			channel:"C02B9VBSFHP",
			text: message
		});
		
		const result11 = await app.client.chat.postMessage({
			token:context.botToken,
			channel:channelID,
			text: ":alphabet-white-a::alphabet-white-t::alphabet-white-c::thread:"
		});
		
		message = "<!subteam^S02DTQD49B6> please use this thread for discussion about <#" + channelID + ">"
		
		const result12 = await app.client.chat.postMessage({
			token:context.botToken,
			channel:channelID,
			thread_ts:result11.ts,
			text: message
		});

  	} 
	catch (error) {
		console.error(error);
		console.log(error.data);
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
	  
//	      	let result2 = await queryOne({"channel.name":"event-iah-thunderstorm-10-14-21"});
//	  
//		const result9 = await app.client.admin.conversations.setConversationPrefs({
//		token:process.env.USER_TOKEN,
//		channel_id:result2.channel.id,
//		prefs: "{'who_can_post':'type:admin'}"
//		});
  }
	catch (error) {
	console.error(error);
	}
});

app.action('viewactiveevents', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  try {
	    const result = await app.client.views.open({
	      token: context.botToken,
	      trigger_id: body.trigger_id,
	      view: {
		"title": {
			"type": "plain_text",
			"text": "Active Events",
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
			"text": "Open in UnitedView",
			"emoji": true
		},
		"callback_id": "createeventmodal",
		"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":firefighter: |   *ACTIVE WEATHER EVENTS*  | :firefighter:"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "`Sev 1` :red_circle:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "IAH Thunderstorms: <https://www.slack.com|#event-iah-thunderstorm-10-14-21>"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "`Sev 2` :blue_circle:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "ORD Thunderstorms: <https://www.slack.com|#event-ord-thunderstorms>\nTropical Storm Henri: <https://www.slack.com|#event-tropical-storm-henri>"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "`Sev 3` :white_circle:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Hail Over Hawaii: <https://www.slack.com|#event-hawaiian-hailstorm>"
			}
		}
	]
		}
	    });
	  
//	      	let result2 = await queryOne({"channel.name":"event-iah-thunderstorm-10-14-21"});
//	  
//		const result9 = await app.client.admin.conversations.setConversationPrefs({
//		token:process.env.USER_TOKEN,
//		channel_id:result2.channel.id,
//		prefs: "{'who_can_post':'type:admin'}"
//		});
  }
	catch (error) {
	console.error(error);
	}
});

app.action('escalateevent', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
	"title": {
		"type": "plain_text",
		"text": "Change Severity",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Change Severity",
		"emoji": true
	},
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"callback_id": "changeseveritymodal",
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
							"text": "Sev 1 :red_circle:",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Sev 2 :blue_circle:",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Sev 3 :white_circle:",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"initial_option": {
					"text": {
						"type": "plain_text",
						"text": "Sev 2 :blue_circle:",
						"emoji": true
					},
					"value": "value-1"
				},
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Severity:",
				"emoji": true
			},
			"block_id": "severity"
		}
	]
}
    });
  }
	catch (error) {
	console.error(error);
	}
});

app.view('changeseveritymodal', async ({ ack, body, view, context }) => {
  // Acknowledge the view_submission event
  ack();

	try {
    		let result = await queryOne({"channel.name":"event-iah-thunderstorm-10-14-21"});
		
		const result5 = await app.client.conversations.setTopic({
			token:context.botToken,
			channel:result.channel.id,
			topic:"*Moderator:* <@W012T182X9B>  *Severity:* :red_circle: Sev 1"
		});	
		
		let message = ":red_circle: *An Event has Been Escalated to Sev 1* \n*Headline:* Thunderstorms have been moving slowly through the N90 airspace, blocking departure\n*Channel:* <#" + result.channel.id + ">"
		
		const result7 = await app.client.chat.postMessage({
			token:context.botToken,
			channel:"C02D4MEFN2E",
			text: message
		});

  	} 
	catch (error) {
		console.error(error);
	}

});

app.action('modifyaudience', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
	"title": {
		"type": "plain_text",
		"text": "Update Audience",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Update Audience",
		"emoji": true
	},
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"callback_id": "updateaudiencemodal",
	"blocks": [
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
							"text": "FOS",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Dispatch",
							"emoji": true
						},
						"value": "value-2"
					}
				],
				"initial_options": [
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
					}
				],
				"action_id": "static_select-actionold"
			},
			"label": {
				"type": "plain_text",
				"text": "Audience:",
				"emoji": true
			},
			"block_id": "audienceold"
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
				"text": "FOS"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": ":heavy_plus_sign:",
					"emoji": true
				},
				"value": "click_me_123",
				"action_id": "addFOS"
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
  }
	catch (error) {
	console.error(error);
	}
});

app.action('addFOS', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  try {
    const result = await app.client.views.update({
      token: context.botToken,
      view_id: body.view.id,
      view: {
	"title": {
		"type": "plain_text",
		"text": "Update Audience",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Update Audience",
		"emoji": true
	},
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"callback_id": "updateaudiencemodal2",
	"blocks": [
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
						"value": "value-3"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "FOS",
							"emoji": true
						},
						"value": "value-4"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Dispatch",
							"emoji": true
						},
						"value": "value-5"
					}
				],
				"initial_options": [
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
							"text": "FOS",
							"emoji": true
						},
						"value": "value-4"
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
				"text": "Dispatch"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": ":heavy_plus_sign:",
					"emoji": true
				},
				"value": "click_me_123",
				"action_id": "addDispatch"
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
  }
	catch (error) {
	console.error(error);
	}
});

app.view('updateaudiencemodal2', async ({ ack, body, view, context }) => {
  // Acknowledge the view_submission event
  ack();

	try {
    		let result = await queryOne({"channel.name":"event-iah-thunderstorm-10-14-21"});
		console.log(result);
		
		const result2 = await app.client.conversations.invite({
			token:context.botToken,
			channel:result.channel.id,
			users:"W017N3Y6BF1, WT3PAEL8Z,W0183GWHSPM,WT14YEUJW,WTDU3G24Q, WT2EBG3QB,WT2EC2TJ7,WT2EC5M4K"
		});
		
		const result11 = await app.client.chat.postMessage({
			token:context.botToken,
			channel:result.channel.id,
			text: ":alphabet-white-f::alphabet-white-o::alphabet-white-s::thread:"
		});
		
		message = "<!subteam^S02DMMJLGFL> please use this thread for discussion about <#" + result.channel.id + ">"
		
		const result12 = await app.client.chat.postMessage({
			token:context.botToken,
			channel:result.channel.id,
			thread_ts:result11.ts,
			text: message
		});
		
//		const result6 = await app.client.chat.postMessage({
//			token:context.botToken,
//			channel:result.channel.id,
//			thread_ts:result3.ts,
//			text:"*Description:*\nThunderstorms have been moving slowly through the N90 airspace, blocking departure and arrival routes to the west and south of EWR, causing gate returns for re-routes as well as diversions due to arrival holding or lengthy weather deviations.\nEWR was under a modified 2nd tier ground stop from 1454 until 1601.3 arrivals diverted to IAD due to weather"
//		});		

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

app.action('closeeevent', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
	"type": "modal",
	"callback_id":"closeeventsubmit",
	"submit": {
		"type": "plain_text",
		"text": "Confirm",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"title": {
		"type": "plain_text",
		"text": "Close Event",
		"emoji": true
	},
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Closing Event:*\n'Thunderstorms have been moving slowly through the N90 airspace' \n\n*Archiving channel:*\n <fakelink.toChannel.com|#event-iah-thunderstorm-10-14-21>"
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "checkboxes",
					"options": [
						{
							"text": {
								"type": "plain_text",
								"text": "Postmortem Needed"
							},
							"value": "tasks",
							"description": {
								"type": "plain_text",
								"text": "Will add a postmortem event to calendars"
							}
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Resolution Alert"
							},
							"value": "comments",
							"description": {
								"type": "plain_text",
								"text": "Will notify all 'tag' channels of event resolution"
							}
						}
					]
				}
			]
		}
	]
}
    });
  }
	catch (error) {
	console.error(error);
	}
});

app.view('closeeventsubmit', async ({ ack, body, view, context }) => {
  // Acknowledge the view_submission event
  ack();

	try {
    		let result = await queryOne({"channel.name":"event-iah-thunderstorm-10-14-21"});
		console.log(result);
		
		const result2 = await app.client.conversations.archive({
			token:context.botToken,
			channel:result.channel.id
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
	
//delete from the database using a query
function deleteRecords(query) {
  return new Promise((resolve, reject) => {
    db.remove(query, {multi:true}, (err, docs) => {
      if (err) console.log("There's a problem with the database: ", err);
      else if (docs) console.log(query + " deleteRecords run successfully.");
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
