"use client";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";

export default function HeaderClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  return (
    <div>
      {isLoggedin ? (
        <div>logged in</div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer !py-5  ">
              Login
            </Button>
          </DialogTrigger>
        </Dialog>
      )}
    </div>
  );
}
