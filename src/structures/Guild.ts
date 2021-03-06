/* eslint-disable no-extra-parens */
import { Structures } from "discord.js";
import BotClient from "../handlers/BotClient";
import { IGuild } from "../typings";

Structures.extend("Guild", DJSGuild => {
    class Guild extends DJSGuild implements IGuild {
        readonly me!: IGuild["me"];
        readonly owner!: IGuild["owner"];
        public member!: IGuild["member"];
        public members!: IGuild["members"];
        readonly voice!: IGuild["voice"];
        public voiceStates!: IGuild["voiceStates"];
        public setOwner!: IGuild["setOwner"];
        public client!: BotClient;
        public config!: IGuild["config"];
        constructor(client: BotClient, data: object) {
            super(client, data);
            this.config = { prefix: client.config.prefix, allowDefaultPrefix: true };
            client.db.guild.findById(this.id).then(data => {
                if (data === null) return this.create();
                delete (data.config as any).$init;
                Object.assign(this.config, data.config);
            });
        }
        public async updateConfig(config: IGuild["config"]): Promise<IGuild> {
            const data = await this.client.db.guild.findById(this.id);
            data!.config = Object.assign(this.config, config);
            data!.save();
            return this;
        }
        public syncConfig(): IGuild["config"] {
            this.client.db.guild.findById(this.id).then(data => {
                if (data === null) return this.create();
                delete (data.config as any).$init;
                Object.assign(this.config, data.config);
            });
            return this.config;
        }
        private create(): void {
            new this.client.db.guild({_id: this.id, config: { prefix: this.client.config.prefix, allowDefaultPrefix: true } }).save();
        }
    }

    return Guild; // TODO: Instead of this, why not return class Guild ?
});
