-- AddForeignKey
ALTER TABLE "server_metrics" ADD CONSTRAINT "server_metrics_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
