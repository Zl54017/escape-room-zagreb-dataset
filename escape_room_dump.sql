--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: escape_room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.escape_room (
    id integer NOT NULL,
    naziv text NOT NULL,
    adresa text,
    tvrtka_id integer,
    tematika_id integer,
    tezina numeric,
    trajanje_minute integer,
    maks_igraca integer,
    web_stranica text,
    CONSTRAINT escape_room_tezina_check CHECK (((tezina >= (1)::numeric) AND (tezina <= (5)::numeric)))
);


ALTER TABLE public.escape_room OWNER TO postgres;

--
-- Name: escape_room_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.escape_room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.escape_room_id_seq OWNER TO postgres;

--
-- Name: escape_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.escape_room_id_seq OWNED BY public.escape_room.id;


--
-- Name: tematika; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tematika (
    id integer NOT NULL,
    naziv text NOT NULL
);


ALTER TABLE public.tematika OWNER TO postgres;

--
-- Name: tematika_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tematika_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tematika_id_seq OWNER TO postgres;

--
-- Name: tematika_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tematika_id_seq OWNED BY public.tematika.id;


--
-- Name: tvrtka; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tvrtka (
    id integer NOT NULL,
    naziv text NOT NULL,
    web_stranica text,
    kontakt text
);


ALTER TABLE public.tvrtka OWNER TO postgres;

--
-- Name: tvrtka_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tvrtka_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tvrtka_id_seq OWNER TO postgres;

--
-- Name: tvrtka_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tvrtka_id_seq OWNED BY public.tvrtka.id;


--
-- Name: escape_room id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escape_room ALTER COLUMN id SET DEFAULT nextval('public.escape_room_id_seq'::regclass);


--
-- Name: tematika id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tematika ALTER COLUMN id SET DEFAULT nextval('public.tematika_id_seq'::regclass);


--
-- Name: tvrtka id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tvrtka ALTER COLUMN id SET DEFAULT nextval('public.tvrtka_id_seq'::regclass);


--
-- Data for Name: escape_room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.escape_room (id, naziv, adresa, tvrtka_id, tematika_id, tezina, trajanje_minute, maks_igraca, web_stranica) FROM stdin;
1	Tajna Profesora Baltazara	Ulica kneza Borne 12	1	4	4.5	75	5	https://www.cluego.eu/tajna-profesora-balthazara/
2	Krađa Mona Lise	Ulica kneza Borne 12	1	2	5	75	6	https://www.cluego.eu/krada-mona-lise/
3	Memento	Ulica kneza Borne 12	1	2	4	75	5	https://www.cluego.eu/memento/
4	Anno	Draškovićeva 29	1	4	5	75	6	https://www.cluego.eu/anno-1202/
5	Magična knjižnica	Draškovićeva 53	2	3	5	75	6	https://escapeart.hr/magicna-knjiznica/
6	Drakuline odaje	Draškovićeva 53	2	3	3	75	6	https://escapeart.hr/drakuline-odaje/#rezervacije
7	Robin Hood	Draškovićeva 53	2	3	4.5	60	6	https://escapeart.hr/robin-hood/#rezervacije
8	Promatrači	Vodnikova 8	3	1	3	60	6	https://www.theoldlockup.com/room-detail.asp?roomid=9
9	Ritual	Draškovićeva 72	3	1	5	60	6	https://www.theoldlockup.com/room-detail.asp?roomid=8
10	Soba Panike	Vodnikova 8	3	1	2	60	6	https://www.theoldlockup.com/room-detail.asp?roomid=7
11	Narcos	Vodnikova 8	3	1	1	60	6	https://www.theoldlockup.com/room-detail.asp?roomid=6
12	Presuda	Maksimirska 96	3	1	5	60	6	https://www.theoldlockup.com/room-detail.asp?roomid=5
13	Mrtvačnica	Maksimirska 96	3	1	2	60	6	https://www.theoldlockup.com/room-detail.asp?roomid=4
14	Kripta	Vinkovićeva 6	3	1	1	60	6	https://www.theoldlockup.com/room-detail.asp?roomid=3
15	Ukleti Hotel	Vinkovićeva 6	3	1	5	60	6	https://www.theoldlockup.com/room-detail.asp?roomid=2
16	Otmica	Vinkovićeva 6	3	1	1	60	6	https://www.theoldlockup.com/room-detail.asp?roomid=1
17	Zodiac killer	Ulica kneza Mislava 14	4	2	3	60	6	https://zagreb.roomescape.hr/p/rooms/zodiac-killer/
18	Pljačka banke	Ulica kneza Mislava 14	4	2	2	60	6	https://zagreb.roomescape.hr/p/rooms/golden-nugget-saloon/
19	Bijeg iz zatvora	Ulica kneza Mislava 14	4	2	3	60	6	https://zagreb.roomescape.hr/p/rooms/prison-break/
20	Tajanstveni slučaj zagrebačke vještice	Krvavi most 3	5	3	1	60	5	https://enigmarium.hr/tajanstveni-slucaj-zagrebacke-vjestice/
21	Femme Fatale	Krvavi most 3	5	3	1	60	5	https://enigmarium.hr/femme-fatale/
22	Laboratorij Crne kraljice	Krvavi most 3	5	1	2	75	5	https://enigmarium.hr/laboratorij-crne-kraljice/
23	Ozirisov hram	Amruševa 8	5	3	4	80	8	https://portalescape.com/avanture/
24	Dvorac Crne Kraljice	Amruševa 8	5	4	3	60	8	https://portalescape.com/avanture/
25	Kocke	Amruševa 8	5	2	5	75	8	https://portalescape.com/avanture/
26	Tajna Don Carla	Amruševa 8	5	2	3	75	8	https://portalescape.com/avanture/
27	Mind Crime	Zagrebački Velesajam, Paviljon 35, ulaz ISTOK III	6	3	3	60	5	https://www.escape-arena.com/game-rooms/mind-crime-2/?_gl=1*i3jjc8*_ga*MTY4NTU5MTAzNC4xNzYxNDExNzI1*_up*MQ..
28	The office of John Monroe	Zagrebački Velesajam, Paviljon 35, ulaz ISTOK III	6	2	3.5	60	5	https://www.escape-arena.com/game-rooms/the-office-of-john-monroe/?_gl=1*i3jjc8*_ga*MTY4NTU5MTAzNC4xNzYxNDExNzI1*_up*MQ..
29	The lab of Dr. Lev Pasted	Zagrebački Velesajam, Paviljon 35, ulaz ISTOK III	6	1	4	60	5	https://www.escape-arena.com/game-rooms/lev-pasted/?_gl=1*i3jjc8*_ga*MTY4NTU5MTAzNC4xNzYxNDExNzI1*_up*MQ..
30	The amazing heist	Zagrebački Velesajam, Paviljon 35, ulaz ISTOK III	6	4	4.5	60	5	https://www.escape-arena.com/game-rooms/amazing-heist/?_gl=1*i3jjc8*_ga*MTY4NTU5MTAzNC4xNzYxNDExNzI1*_up*MQ..
31	The secret agent room	Zagrebački Velesajam, Paviljon 35, ulaz ISTOK III	6	2	3.5	60	5	https://www.escape-arena.com/game-rooms/secret-agent-room/?_gl=1*i3jjc8*_ga*MTY4NTU5MTAzNC4xNzYxNDExNzI1*_up*MQ..
32	EX(IT) YU	Maruševečka ulica 8	7	4	3	70	6	https://www.elephantescape.hr/
\.


--
-- Data for Name: tematika; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tematika (id, naziv) FROM stdin;
1	Horror
2	Detektivska
3	Sci-Fi
4	Avanturistička
\.


--
-- Data for Name: tvrtka; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tvrtka (id, naziv, web_stranica, kontakt) FROM stdin;
1	ClueGo Escape Room Zagreb	www.cluego.eu	+385994563099
2	Escape Art - Escape Room Zagreb	www.escapeart.hr	+385991697344
3	The Old Lock Up Escape Room Zagreb	www.theoldlockup.com	+385913630000
4	Fox in a box - Escape Room Zagreb	www.zagreb.roomescape.hr	+385913697666
5	Escape Room Enigmarium Zagreb	www.enigmarium.hr	+385916155456
6	Portal Escape	www.portalescape.com	+385014444555
7	Escape Room Arena	www.escape-arena.com	+38516024470
8	Elephant in the Escape Room	www.elephantescape.hr	+385917272294
\.


--
-- Name: escape_room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.escape_room_id_seq', 32, true);


--
-- Name: tematika_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tematika_id_seq', 4, true);


--
-- Name: tvrtka_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tvrtka_id_seq', 8, true);


--
-- Name: escape_room escape_room_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escape_room
    ADD CONSTRAINT escape_room_pkey PRIMARY KEY (id);


--
-- Name: tematika tematika_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tematika
    ADD CONSTRAINT tematika_pkey PRIMARY KEY (id);


--
-- Name: tvrtka tvrtka_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tvrtka
    ADD CONSTRAINT tvrtka_pkey PRIMARY KEY (id);


--
-- Name: escape_room escape_room_tematika_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escape_room
    ADD CONSTRAINT escape_room_tematika_id_fkey FOREIGN KEY (tematika_id) REFERENCES public.tematika(id);


--
-- Name: escape_room escape_room_tvrtka_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escape_room
    ADD CONSTRAINT escape_room_tvrtka_id_fkey FOREIGN KEY (tvrtka_id) REFERENCES public.tvrtka(id);


--
-- PostgreSQL database dump complete
--

