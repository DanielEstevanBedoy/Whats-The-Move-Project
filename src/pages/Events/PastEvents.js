import React from "react";
import Events from  "./Events.js";

export default function PastEvents()
{
    return (
	<Events lookForward={false} />
    );
}
