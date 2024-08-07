import { JSDOM } from 'jsdom';

// These mocks ensure that the real server, storage and refresher will not be used
jest.mock('../../src/server', () => ({
    IO: {
        local: {
            emit: (...args) => {},
        },
    },
}));
jest.mock('../../src/common/utils/common-utils', () => ({
    ...jest.requireActual('../../src/common/utils/common-utils'),
    staticRefresher: (...args) => {},
}));
jest.mock('../../src/common/utils/storage-utils', () => ({
    ObjectStorage: class TestObject {
        write(...args) {
            // Do nothing
        }
    },
}));

describe('News-Worker should collect news as expected', () => {
    describe('Ars Technica', () => {
        it('should collect Ars Technica news correctly', async () => {
            const {
                getArsTechnicaNews,
            } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            await getArsTechnicaNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0]).toEqual([
                'NEWS',
                'Ars_Technica',
                "Ars_Technica's Latest News.",
                [
                    {
                        date: '2023-02-01T15:46:04.563Z',
                        title: 'Test Title',
                        url: '/test',
                    },
                ],
            ]);
        });

        it('should use default values for Ars Technica content if missing', async () => {
            const {
                getArsTechnicaNews,
            } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            const commonUtils = require('../../src/common/utils/common-utils');
            const document = new JSDOM(`
            <li>
                <div class="article">
                    <h2>
                        Test Title
                    </h2>
                </div>
            </li>
        `).window.document;

            jest.spyOn(commonUtils, 'fetchArticles').mockResolvedValueOnce({
                outlet: 'Ars_Technica',
                unformattedArticles: [document],
            });

            await getArsTechnicaNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0][3]).toEqual([
                {
                    title: 'Test Title',
                    date: new Date().toISOString(),
                    url: 'Not Found',
                },
            ]);
        });
    });

    describe('NASA', () => {
        it('should collect the nasa daily image correctly', async () => {
            const { getNasaImage } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            await getNasaImage();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0]).toEqual([
                'NEWS',
                'NASA',
                'NASA Daily Image.',
                [
                    {
                        date: '2023-02-01T00:00:00.000Z',
                        description: 'Test Explanation',
                        img: 'test-image.png',
                        title: 'Test Title',
                        url: 'test-image.png',
                    },
                ],
            ]);
        });
    });

    describe('PC Gamer', () => {
        it('should collect PCGamer news correctly', async () => {
            const { getPCGamerNews } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            await getPCGamerNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0]).toEqual([
                'NEWS',
                'PCGamer',
                "PCGamer's Latest News.",
                [
                    {
                        date: '2023-02-01T15:46:04.563Z',
                        img: 'test-img.png',
                        title: 'Test Title',
                        url: '/test',
                    },
                ],
            ]);
        });

        it('should use default values for PCGamer content if missing', async () => {
            const { getPCGamerNews } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            const commonUtils = require('../../src/common/utils/common-utils');
            const document = new JSDOM(`
            <li>
                <div class="li">
                    <div class="article-name">
                        Test Title
                    </div>
                </div>
            </li>
        `).window.document;

            jest.spyOn(commonUtils, 'fetchArticles').mockResolvedValueOnce({
                outlet: 'PCGamer',
                unformattedArticles: [document],
            });

            await getPCGamerNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0][3]).toEqual([
                {
                    title: 'Test Title',
                    date: new Date().toISOString(),
                    img: 'Not Found',
                    url: 'Not Found',
                },
            ]);
        });
    });

    describe('Rock Paper Shotgun', () => {
        it('should collect RPS news correctly', async () => {
            const { getRPSNews } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            await getRPSNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0]).toEqual([
                'NEWS',
                'Rock_Paper_Shotgun',
                "Rock_Paper_Shotgun's Latest News.",
                [
                    {
                        date: '2023-02-01T15:46:04.563Z',
                        img: 'test-img.png',
                        title: 'Test Title',
                        url: '/test',
                    },
                ],
            ]);
        });

        it('should use default values for RPS content if missing', async () => {
            const { getRPSNews } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            const commonUtils = require('../../src/common/utils/common-utils');
            const document = new JSDOM(`
                <li>
                    <div class="li">
                        <div class="title">
                            <div>Test Title</div>
                        </div>
                    </div>
                </li>
            `).window.document;

            jest.spyOn(commonUtils, 'fetchArticles').mockResolvedValueOnce({
                outlet: 'Rock_Paper_Shotgun',
                unformattedArticles: [document],
            });

            await getRPSNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0][3]).toEqual([
                {
                    title: 'Test Title',
                    date: new Date().toISOString(),
                    img: 'Not Found',
                    url: 'Not Found',
                },
            ]);
        });
    });

    describe('The Register', () => {
        it('should collect The Register news correctly', async () => {
            const {
                getRegisterNews,
            } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            await getRegisterNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0]).toEqual([
                'NEWS',
                'The_Register',
                "The_Register's Latest News.",
                [
                    {
                        date: '1970-01-01T00:00:00.000Z',
                        title: 'Test Title',
                        url: 'https://www.theregister.com/test',
                    },
                ],
            ]);
        });

        it('should use default values for The Register content if missing', async () => {
            const {
                getRegisterNews,
            } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            const commonUtils = require('../../src/common/utils/common-utils');
            const document = new JSDOM(`
                <li>
                    <article>
                        <h4 class="title">
                            Test Title
                        </h4>
                    </article>
                </li>
            `).window.document;

            jest.spyOn(commonUtils, 'fetchArticles').mockResolvedValueOnce({
                outlet: 'The_Register',
                unformattedArticles: [document],
            });

            await getRegisterNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0][3]).toEqual([]);
        });
    });

    describe('BBC', () => {
        it('should collect bbc news correctly', async () => {
            const { getUKNews } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            await getUKNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0]).toEqual([
                'NEWS',
                'BBC',
                "BBC's Latest News.",
                [
                    {
                        date: (storageSpy.mock.calls[0][3] as any)[0].date,
                        img: 'test-img.png',
                        title: 'Test Title',
                        url: 'https://www.bbc.co.uk/test',
                    },
                ],
            ]);
        });

        it('should use default values for BBC content if missing', async () => {
            const { getUKNews } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            const commonUtils = require('../../src/common/utils/common-utils');
            const document = new JSDOM(`
                <li>
                    <div type="article">
                        <div role="text">
                            <span>Test Title</span>
                        </div>
                    </div>
                </li>
            `).window.document;

            jest.spyOn(commonUtils, 'fetchArticles').mockResolvedValueOnce({
                outlet: 'BBC',
                unformattedArticles: [document],
            });

            await getUKNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0][3]).toEqual([
                {
                    title: 'Test Title',
                    date: (storageSpy.mock.calls[0][3] as any)[0].date,
                    img: 'Not Found',
                    url: 'Not Found',
                },
            ]);
        });

        it('should handle invalid titles for BBC if missing', async () => {
            const { getUKNews } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            const commonUtils = require('../../src/common/utils/common-utils');
            const document = new JSDOM(`
                <li>
                    <div type="article">
                        <div role="text"></div>
                    </div>
                </li>
            `).window.document;

            jest.spyOn(commonUtils, 'fetchArticles').mockResolvedValueOnce({
                outlet: 'BBC',
                unformattedArticles: [document],
            });

            await getUKNews();

            expect(storageSpy.mock.calls.length).toEqual(1);
            expect(storageSpy.mock.calls[0][3]).toEqual([]);
        });

        it('should handle datetime correctly', async () => {
            const { getUKNews } = require('../../src/workers/news-worker');
            const { storage } = require('../../src');
            const storageSpy = jest.spyOn(storage, 'write');

            const commonUtils = require('../../src/common/utils/common-utils');

            // First article should be within the last few minutes
            const currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() - 3);
            const [currentHour, currentMinute] = currentDate
                .toLocaleTimeString('en-GB')
                .split(':');
            const document1 = new JSDOM(`
                <article
                    type="article"
                    class="article"
                >
                    <h3><span>${currentHour}:${currentMinute}</span></h3>
                    <img
                        data-original="test-img.png"
                        class=""
                        src="test-img.png"
                        data-src="test-img.png"
                        alt="testing"
                    />
                    <h4
                        role="text"
                        class="text"
                    >
                        Test Title <span>Test Title</span>
                    </h4>
                </article>
            `).window.document;

            // Second article should be from the "future"
            const futureDate = new Date();

            futureDate.setHours(futureDate.getHours() + 2);
            const [futureHour, futureMinute] = futureDate
                .toLocaleTimeString('en-GB')
                .split(':');
            const document2 = new JSDOM(`
                <article
                    type="article"
                    class="article"
                >
                    <h3><span>${futureHour}:${futureMinute}</span></h3>
                    <img
                        data-original="test-img.png"
                        class=""
                        src="test-img.png"
                        data-src="test-img.png"
                        alt="testing"
                    />
                    <h4
                        role="text"
                        class="text"
                    >
                        Test Title <span>Test Title</span>
                    </h4>
                </article>
            `).window.document;

            jest.spyOn(commonUtils, 'fetchArticles').mockResolvedValueOnce({
                outlet: 'BBC',
                unformattedArticles: [document1, document2],
            });

            await getUKNews();

            expect(storageSpy.mock.calls.length).toEqual(1);

            const date = new Date();

            // Non-future times are assumed to be today
            expect(
                (storageSpy.mock.calls[0][3] as any[])[0].date.split('T')[0]
            ).toEqual(date.toISOString().split('T')[0]);

            // Future times are assumed to be from yesterday
            date.setDate(date.getDate() - 1);
            date.setHours(20);
            expect(
                (storageSpy.mock.calls[0][3] as any[])[1].date.split('T')[0]
            ).toEqual(date.toISOString().split('T')[0]);
        });
    });

    it('should call all collectors when requested', () => {
        const { getNews } = require('../../src/workers/news-worker');
        const newsWorker = require('../../src/workers/news-worker');

        const getArsTechnicaNews = jest.spyOn(newsWorker, 'getArsTechnicaNews');
        const getNasaImage = jest.spyOn(newsWorker, 'getNasaImage');
        const getPCGamerNews = jest.spyOn(newsWorker, 'getPCGamerNews');
        const getRPSNews = jest.spyOn(newsWorker, 'getRPSNews');
        const getRegisterNews = jest.spyOn(newsWorker, 'getRegisterNews');
        const getUKNews = jest.spyOn(newsWorker, 'getUKNews');

        getNews();

        expect(getArsTechnicaNews).toBeCalledTimes(1);
        expect(getNasaImage).toBeCalledTimes(1);
        expect(getPCGamerNews).toBeCalledTimes(1);
        expect(getRPSNews).toBeCalledTimes(1);
        expect(getRegisterNews).toBeCalledTimes(1);
        expect(getUKNews).toBeCalledTimes(1);
    });
});
