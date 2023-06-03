import React from "react";
import Events from  "./Planning.js";

export default function PastEvents()
{
    return (
	<Events lookForward={false} />
    );
}
