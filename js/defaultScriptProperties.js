var defaultScriptProperties = {
	"Set Camera": {
		ports:[
			{
				type: "execute",
				side: "up",
				x: 0,
				y: 0,
				label: "Before"
			},				
			{
				type: "vector",
				side: "left",
				x: 0,
				y: 0,
				label: "Position"
			},			
			{
				type: "rotation",
				side: "left",
				x: 0,
				y: 1,
				label: "Rotation"
			},
			{
				type: "number",
				side: "left",
				x: 0,
				y: 2,
				label: "Distance"
			},
			{
				type: "execute",
				side: "down",
				x: 0,
				y: 2,
				label: "After"
			}
		]
	}
}