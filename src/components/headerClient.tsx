"use client";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
          <DialogContent>
            <Tabs className="w-full p-4 ">
              <TabsList className="w-full grid grid-cols-2 ">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login"></TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
