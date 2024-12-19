-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_spectatorId_fkey" FOREIGN KEY ("spectatorId") REFERENCES "Spectator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
