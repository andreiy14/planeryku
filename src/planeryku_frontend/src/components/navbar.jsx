import { useState } from "react";
import { DashboardIcon, InboxIcon, PlusIcon } from "./icon";
import { Button, IconButton } from "@mui/material";
import HorizontalMenuIcon from "./icon/horizontal-menu";

export default function Navbar() {
	const [showSidebar, setShowSidebar] = useState(false);

	return (
		<div className="">
			<div className="p-5 border-b border-slate-200 flex h-[70px] max-h-[70px]">
				<div className="flex gap-2 items-center ml-auto">
					<InboxIcon/>
					<span>
						Hi, Michael
					</span>
				</div>
			</div>
		</div>
	);
}
