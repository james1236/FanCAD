var defaultScriptProperties = {
	"Set Camera": {
		scale:{
			x:2,
			y:3
		},
		
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
				type: "vector",
				side: "right",
				x: 1,
				y: 0,
				label: "Test"
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