import { getGameData, checkSteamApi } from "../../src/workers/steam-worker";
import { steamContent, steamUserContent } from "../data/test-data";
const mockAxios = globalThis.__mockAxios__;

describe("the steam worker should correctly validate data and return it", () => {
    it("should return a valid object containing achievements without a steam userId", async () => {
        mockAxios
            .onGet(
                `${process.env.STEAM_API}/ISteamUserStats/GetSchemaForGame/v0002?key=${process.env.STEAM_API_KEY}&appid=TestGameID`
            )
            .replyOnce(200, steamContent);

        const req = {
            query: {
                userId: undefined,
                gameId: "TestGameID",
            },
        };

        const result = await getGameData(req as any);

        expect(result).toEqual({
            achievements: [
                {
                    name: "1",
                    defaultvalue: 0,
                    displayName: "Test Achievement",
                    hidden: 0,
                    description: "New Achievement!",
                    icon: "steamIcon",
                    icongray: "steamIconGray",
                },
            ],
            wiki: undefined,
        });
    });

    it("should return a valid object containing achievements with a steam userId", async () => {
        mockAxios
            .onGet(
                `${process.env.STEAM_API}/ISteamUserStats/GetSchemaForGame/v0002?key=${process.env.STEAM_API_KEY}&appid=TestGameID`
            )
            .replyOnce(200, steamContent);

        mockAxios
            .onGet(
                `${process.env.STEAM_API}/ISteamUserStats/GetPlayerAchievements/v0001?key=${process.env.STEAM_API_KEY}&appid=TestGameID&steamid=SteamUserID`
            )
            .replyOnce(200, steamUserContent);

        const req = {
            query: {
                userId: "SteamUserID",
                gameId: "TestGameID",
            },
        };

        const result = await getGameData(req as any);

        expect(result).toEqual({
            achievements: [
                {
                    achieved: 1,
                    apiname: "1",
                    name: "1",
                    defaultvalue: 0,
                    displayName: "Test Achievement",
                    hidden: 0,
                    description: "New Achievement!",
                    icon: "steamIcon",
                    icongray: "steamIconGray",
                    unlocktime: 1657572168,
                },
            ],
            wiki: undefined,
        });
    });

    it("should throw if steam API is down", async () => {
        mockAxios
            .onGet(
                `${process.env.STEAM_API}/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=`
            )
            .replyOnce(502);

        try {
            await checkSteamApi();
        } catch (e) {
            expect(e.message).toEqual("Request failed with status code 502");
        }
    });

    it("should throw if no gameId is given", async () => {
        const req = {
            query: {
                userId: undefined,
                gameId: undefined,
            },
        };

        try {
            await getGameData(req as any);
        } catch (e) {
            expect(e.message).toEqual("No gameId provided!");
            expect(e.code).toEqual("422");
        }
    });

    it("should throw if axios call to steam fails", async () => {
        mockAxios
            .onGet(
                `${process.env.STEAM_API}/ISteamUserStats/GetSchemaForGame/v0002?key=${process.env.STEAM_API_KEY}&appid=TestGameID`
            )
            .replyOnce(502, { message: "Bad Gateway" });

        const req = {
            query: {
                userId: "SteamUserID",
                gameId: "TestGameID",
            },
        };

        try {
            await getGameData(req as any);
        } catch (e) {
            expect(e.message).toEqual("Could not process request");
            expect(e.code).toEqual("502");
        }
    });
});
