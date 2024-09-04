PGDMP                      |            MusicPlatform    16.3    16.3 m    D           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            E           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            F           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            G           1262    41862    MusicPlatform    DATABASE     �   CREATE DATABASE "MusicPlatform" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE "MusicPlatform";
                postgres    false                        2615    45990    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            H           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   postgres    false    5            I           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   postgres    false    5            �            1259    46061    Album    TABLE     G  CREATE TABLE public."Album" (
    id integer NOT NULL,
    name text NOT NULL,
    "artistId" integer NOT NULL,
    genre text NOT NULL,
    picture text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    listens integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL
);
    DROP TABLE public."Album";
       public         heap    postgres    false    5            �            1259    46060    Album_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Album_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Album_id_seq";
       public          postgres    false    5    229            J           0    0    Album_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Album_id_seq" OWNED BY public."Album".id;
          public          postgres    false    228            �            1259    46049    Artist    TABLE     =  CREATE TABLE public."Artist" (
    id integer NOT NULL,
    name text NOT NULL,
    genre text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    listens integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    picture text
);
    DROP TABLE public."Artist";
       public         heap    postgres    false    5            �            1259    46048    Artist_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Artist_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Artist_id_seq";
       public          postgres    false    5    227            K           0    0    Artist_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Artist_id_seq" OWNED BY public."Artist".id;
          public          postgres    false    226            �            1259    46073    Comment    TABLE       CREATE TABLE public."Comment" (
    id integer NOT NULL,
    username text NOT NULL,
    text text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    "parentId" integer,
    "trackId" integer,
    "artistId" integer,
    "albumId" integer
);
    DROP TABLE public."Comment";
       public         heap    postgres    false    5            �            1259    46072    Comment_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Comment_id_seq";
       public          postgres    false    5    231            L           0    0    Comment_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;
          public          postgres    false    230            �            1259    46139    ListenedTrack    TABLE     �   CREATE TABLE public."ListenedTrack" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "trackId" integer NOT NULL,
    "listenedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 #   DROP TABLE public."ListenedTrack";
       public         heap    postgres    false    5            �            1259    46138    ListenedTrack_id_seq    SEQUENCE     �   CREATE SEQUENCE public."ListenedTrack_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."ListenedTrack_id_seq";
       public          postgres    false    5    233            M           0    0    ListenedTrack_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public."ListenedTrack_id_seq" OWNED BY public."ListenedTrack".id;
          public          postgres    false    232            �            1259    46012    Role    TABLE     p   CREATE TABLE public."Role" (
    id integer NOT NULL,
    value text NOT NULL,
    description text NOT NULL
);
    DROP TABLE public."Role";
       public         heap    postgres    false    5            �            1259    46011    Role_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."Role_id_seq";
       public          postgres    false    5    219            N           0    0    Role_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."Role_id_seq" OWNED BY public."Role".id;
          public          postgres    false    218            �            1259    46028    Token    TABLE     �   CREATE TABLE public."Token" (
    id integer NOT NULL,
    "refreshToken" text NOT NULL,
    "accessToken" text NOT NULL,
    "userId" integer NOT NULL
);
    DROP TABLE public."Token";
       public         heap    postgres    false    5            �            1259    46027    Token_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Token_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Token_id_seq";
       public          postgres    false    223    5            O           0    0    Token_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Token_id_seq" OWNED BY public."Token".id;
          public          postgres    false    222            �            1259    46037    Track    TABLE     �  CREATE TABLE public."Track" (
    id integer NOT NULL,
    name text NOT NULL,
    listens integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    genre text NOT NULL,
    duration text NOT NULL,
    picture text NOT NULL,
    audio text NOT NULL,
    text text NOT NULL,
    "artistId" integer,
    "albumId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Track";
       public         heap    postgres    false    5            �            1259    46036    Track_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Track_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Track_id_seq";
       public          postgres    false    5    225            P           0    0    Track_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Track_id_seq" OWNED BY public."Track".id;
          public          postgres    false    224            �            1259    46001    User    TABLE        CREATE TABLE public."User" (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    "isActivated" boolean DEFAULT false NOT NULL,
    password text NOT NULL,
    "activationLink" text NOT NULL,
    banned boolean DEFAULT false NOT NULL,
    "banReason" text
);
    DROP TABLE public."User";
       public         heap    postgres    false    5            �            1259    46021    UserRole    TABLE     z   CREATE TABLE public."UserRole" (
    id integer NOT NULL,
    "roleId" integer NOT NULL,
    "userId" integer NOT NULL
);
    DROP TABLE public."UserRole";
       public         heap    postgres    false    5            �            1259    46020    UserRole_id_seq    SEQUENCE     �   CREATE SEQUENCE public."UserRole_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."UserRole_id_seq";
       public          postgres    false    5    221            Q           0    0    UserRole_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."UserRole_id_seq" OWNED BY public."UserRole".id;
          public          postgres    false    220            �            1259    46000    User_id_seq    SEQUENCE     �   CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."User_id_seq";
       public          postgres    false    217    5            R           0    0    User_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;
          public          postgres    false    216            �            1259    46149    _LikedAlbums    TABLE     [   CREATE TABLE public."_LikedAlbums" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 "   DROP TABLE public."_LikedAlbums";
       public         heap    postgres    false    5            �            1259    46152    _LikedArtists    TABLE     \   CREATE TABLE public."_LikedArtists" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 #   DROP TABLE public."_LikedArtists";
       public         heap    postgres    false    5            �            1259    46146    _LikedTracks    TABLE     [   CREATE TABLE public."_LikedTracks" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 "   DROP TABLE public."_LikedTracks";
       public         heap    postgres    false    5            �            1259    45991    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    postgres    false    5            b           2604    46064    Album id    DEFAULT     h   ALTER TABLE ONLY public."Album" ALTER COLUMN id SET DEFAULT nextval('public."Album_id_seq"'::regclass);
 9   ALTER TABLE public."Album" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228    229            ^           2604    46052 	   Artist id    DEFAULT     j   ALTER TABLE ONLY public."Artist" ALTER COLUMN id SET DEFAULT nextval('public."Artist_id_seq"'::regclass);
 :   ALTER TABLE public."Artist" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    227    227            f           2604    46076 
   Comment id    DEFAULT     l   ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);
 ;   ALTER TABLE public."Comment" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    231    231            i           2604    46142    ListenedTrack id    DEFAULT     x   ALTER TABLE ONLY public."ListenedTrack" ALTER COLUMN id SET DEFAULT nextval('public."ListenedTrack_id_seq"'::regclass);
 A   ALTER TABLE public."ListenedTrack" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    232    233    233            W           2604    46015    Role id    DEFAULT     f   ALTER TABLE ONLY public."Role" ALTER COLUMN id SET DEFAULT nextval('public."Role_id_seq"'::regclass);
 8   ALTER TABLE public."Role" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219            Y           2604    46031    Token id    DEFAULT     h   ALTER TABLE ONLY public."Token" ALTER COLUMN id SET DEFAULT nextval('public."Token_id_seq"'::regclass);
 9   ALTER TABLE public."Token" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    223    223            Z           2604    46040    Track id    DEFAULT     h   ALTER TABLE ONLY public."Track" ALTER COLUMN id SET DEFAULT nextval('public."Track_id_seq"'::regclass);
 9   ALTER TABLE public."Track" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    225    225            T           2604    46004    User id    DEFAULT     f   ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);
 8   ALTER TABLE public."User" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            X           2604    46024    UserRole id    DEFAULT     n   ALTER TABLE ONLY public."UserRole" ALTER COLUMN id SET DEFAULT nextval('public."UserRole_id_seq"'::regclass);
 <   ALTER TABLE public."UserRole" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    220    221            :          0    46061    Album 
   TABLE DATA           d   COPY public."Album" (id, name, "artistId", genre, picture, "createdAt", listens, likes) FROM stdin;
    public          postgres    false    229   ��       8          0    46049    Artist 
   TABLE DATA           f   COPY public."Artist" (id, name, genre, description, "createdAt", listens, likes, picture) FROM stdin;
    public          postgres    false    227   �       <          0    46073    Comment 
   TABLE DATA           �   COPY public."Comment" (id, username, text, "createdAt", "updatedAt", likes, "parentId", "trackId", "artistId", "albumId") FROM stdin;
    public          postgres    false    231   ��       >          0    46139    ListenedTrack 
   TABLE DATA           P   COPY public."ListenedTrack" (id, "userId", "trackId", "listenedAt") FROM stdin;
    public          postgres    false    233   ݃       0          0    46012    Role 
   TABLE DATA           8   COPY public."Role" (id, value, description) FROM stdin;
    public          postgres    false    219   ��       4          0    46028    Token 
   TABLE DATA           N   COPY public."Token" (id, "refreshToken", "accessToken", "userId") FROM stdin;
    public          postgres    false    223   �       6          0    46037    Track 
   TABLE DATA           �   COPY public."Track" (id, name, listens, likes, genre, duration, picture, audio, text, "artistId", "albumId", "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    225   ֆ       .          0    46001    User 
   TABLE DATA           u   COPY public."User" (id, username, email, "isActivated", password, "activationLink", banned, "banReason") FROM stdin;
    public          postgres    false    217   ��       2          0    46021    UserRole 
   TABLE DATA           <   COPY public."UserRole" (id, "roleId", "userId") FROM stdin;
    public          postgres    false    221   =�       @          0    46149    _LikedAlbums 
   TABLE DATA           2   COPY public."_LikedAlbums" ("A", "B") FROM stdin;
    public          postgres    false    235   d�       A          0    46152    _LikedArtists 
   TABLE DATA           3   COPY public."_LikedArtists" ("A", "B") FROM stdin;
    public          postgres    false    236   ��       ?          0    46146    _LikedTracks 
   TABLE DATA           2   COPY public."_LikedTracks" ("A", "B") FROM stdin;
    public          postgres    false    234   ��       ,          0    45991    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          postgres    false    215   ��       S           0    0    Album_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Album_id_seq"', 1, false);
          public          postgres    false    228            T           0    0    Artist_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Artist_id_seq"', 2, true);
          public          postgres    false    226            U           0    0    Comment_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Comment_id_seq"', 1, false);
          public          postgres    false    230            V           0    0    ListenedTrack_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."ListenedTrack_id_seq"', 54, true);
          public          postgres    false    232            W           0    0    Role_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."Role_id_seq"', 4, true);
          public          postgres    false    218            X           0    0    Token_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Token_id_seq"', 3, true);
          public          postgres    false    222            Y           0    0    Track_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Track_id_seq"', 2, true);
          public          postgres    false    224            Z           0    0    UserRole_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."UserRole_id_seq"', 2, true);
          public          postgres    false    220            [           0    0    User_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."User_id_seq"', 3, true);
          public          postgres    false    216                       2606    46071    Album Album_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Album"
    ADD CONSTRAINT "Album_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Album" DROP CONSTRAINT "Album_pkey";
       public            postgres    false    229            }           2606    46059    Artist Artist_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Artist"
    ADD CONSTRAINT "Artist_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Artist" DROP CONSTRAINT "Artist_pkey";
       public            postgres    false    227            �           2606    46082    Comment Comment_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Comment" DROP CONSTRAINT "Comment_pkey";
       public            postgres    false    231            �           2606    46145     ListenedTrack ListenedTrack_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public."ListenedTrack"
    ADD CONSTRAINT "ListenedTrack_pkey" PRIMARY KEY (id);
 N   ALTER TABLE ONLY public."ListenedTrack" DROP CONSTRAINT "ListenedTrack_pkey";
       public            postgres    false    233            r           2606    46019    Role Role_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."Role" DROP CONSTRAINT "Role_pkey";
       public            postgres    false    219            x           2606    46035    Token Token_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Token"
    ADD CONSTRAINT "Token_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Token" DROP CONSTRAINT "Token_pkey";
       public            postgres    false    223            {           2606    46047    Track Track_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Track"
    ADD CONSTRAINT "Track_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Track" DROP CONSTRAINT "Track_pkey";
       public            postgres    false    225            u           2606    46026    UserRole UserRole_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."UserRole" DROP CONSTRAINT "UserRole_pkey";
       public            postgres    false    221            o           2606    46010    User User_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public            postgres    false    217            l           2606    45999 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            postgres    false    215            �           1259    48233     ListenedTrack_userId_trackId_idx    INDEX     m   CREATE INDEX "ListenedTrack_userId_trackId_idx" ON public."ListenedTrack" USING btree ("userId", "trackId");
 6   DROP INDEX public."ListenedTrack_userId_trackId_idx";
       public            postgres    false    233    233            s           1259    46085    Role_value_key    INDEX     K   CREATE UNIQUE INDEX "Role_value_key" ON public."Role" USING btree (value);
 $   DROP INDEX public."Role_value_key";
       public            postgres    false    219            y           1259    46087    Token_refreshToken_key    INDEX     ]   CREATE UNIQUE INDEX "Token_refreshToken_key" ON public."Token" USING btree ("refreshToken");
 ,   DROP INDEX public."Token_refreshToken_key";
       public            postgres    false    223            v           1259    46086    UserRole_roleId_userId_key    INDEX     h   CREATE UNIQUE INDEX "UserRole_roleId_userId_key" ON public."UserRole" USING btree ("roleId", "userId");
 0   DROP INDEX public."UserRole_roleId_userId_key";
       public            postgres    false    221    221            m           1259    46084    User_email_key    INDEX     K   CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);
 $   DROP INDEX public."User_email_key";
       public            postgres    false    217            p           1259    46083    User_username_key    INDEX     Q   CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);
 '   DROP INDEX public."User_username_key";
       public            postgres    false    217            �           1259    46158    _LikedAlbums_AB_unique    INDEX     ^   CREATE UNIQUE INDEX "_LikedAlbums_AB_unique" ON public."_LikedAlbums" USING btree ("A", "B");
 ,   DROP INDEX public."_LikedAlbums_AB_unique";
       public            postgres    false    235    235            �           1259    46159    _LikedAlbums_B_index    INDEX     P   CREATE INDEX "_LikedAlbums_B_index" ON public."_LikedAlbums" USING btree ("B");
 *   DROP INDEX public."_LikedAlbums_B_index";
       public            postgres    false    235            �           1259    46160    _LikedArtists_AB_unique    INDEX     `   CREATE UNIQUE INDEX "_LikedArtists_AB_unique" ON public."_LikedArtists" USING btree ("A", "B");
 -   DROP INDEX public."_LikedArtists_AB_unique";
       public            postgres    false    236    236            �           1259    46161    _LikedArtists_B_index    INDEX     R   CREATE INDEX "_LikedArtists_B_index" ON public."_LikedArtists" USING btree ("B");
 +   DROP INDEX public."_LikedArtists_B_index";
       public            postgres    false    236            �           1259    46156    _LikedTracks_AB_unique    INDEX     ^   CREATE UNIQUE INDEX "_LikedTracks_AB_unique" ON public."_LikedTracks" USING btree ("A", "B");
 ,   DROP INDEX public."_LikedTracks_AB_unique";
       public            postgres    false    234    234            �           1259    46157    _LikedTracks_B_index    INDEX     P   CREATE INDEX "_LikedTracks_B_index" ON public."_LikedTracks" USING btree ("B");
 *   DROP INDEX public."_LikedTracks_B_index";
       public            postgres    false    234            �           2606    46113    Album Album_artistId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Album"
    ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES public."Artist"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY public."Album" DROP CONSTRAINT "Album_artistId_fkey";
       public          postgres    false    229    4733    227            �           2606    46133    Comment Comment_albumId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES public."Album"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 J   ALTER TABLE ONLY public."Comment" DROP CONSTRAINT "Comment_albumId_fkey";
       public          postgres    false    229    231    4735            �           2606    46128    Comment Comment_artistId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES public."Artist"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 K   ALTER TABLE ONLY public."Comment" DROP CONSTRAINT "Comment_artistId_fkey";
       public          postgres    false    231    227    4733            �           2606    46118    Comment Comment_parentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Comment"(id);
 K   ALTER TABLE ONLY public."Comment" DROP CONSTRAINT "Comment_parentId_fkey";
       public          postgres    false    4737    231    231            �           2606    46123    Comment Comment_trackId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES public."Track"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 J   ALTER TABLE ONLY public."Comment" DROP CONSTRAINT "Comment_trackId_fkey";
       public          postgres    false    4731    231    225            �           2606    46167 (   ListenedTrack ListenedTrack_trackId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ListenedTrack"
    ADD CONSTRAINT "ListenedTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES public."Track"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 V   ALTER TABLE ONLY public."ListenedTrack" DROP CONSTRAINT "ListenedTrack_trackId_fkey";
       public          postgres    false    233    4731    225            �           2606    46162 '   ListenedTrack ListenedTrack_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ListenedTrack"
    ADD CONSTRAINT "ListenedTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 U   ALTER TABLE ONLY public."ListenedTrack" DROP CONSTRAINT "ListenedTrack_userId_fkey";
       public          postgres    false    217    4719    233            �           2606    46098    Token Token_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Token"
    ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public."Token" DROP CONSTRAINT "Token_userId_fkey";
       public          postgres    false    217    4719    223            �           2606    46108    Track Track_albumId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Track"
    ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES public."Album"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 F   ALTER TABLE ONLY public."Track" DROP CONSTRAINT "Track_albumId_fkey";
       public          postgres    false    229    225    4735            �           2606    46103    Track Track_artistId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Track"
    ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES public."Artist"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 G   ALTER TABLE ONLY public."Track" DROP CONSTRAINT "Track_artistId_fkey";
       public          postgres    false    227    4733    225            �           2606    46088    UserRole UserRole_roleId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 K   ALTER TABLE ONLY public."UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";
       public          postgres    false    219    4722    221            �           2606    46093    UserRole UserRole_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 K   ALTER TABLE ONLY public."UserRole" DROP CONSTRAINT "UserRole_userId_fkey";
       public          postgres    false    221    4719    217            �           2606    46182     _LikedAlbums _LikedAlbums_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_LikedAlbums"
    ADD CONSTRAINT "_LikedAlbums_A_fkey" FOREIGN KEY ("A") REFERENCES public."Album"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."_LikedAlbums" DROP CONSTRAINT "_LikedAlbums_A_fkey";
       public          postgres    false    235    229    4735            �           2606    46187     _LikedAlbums _LikedAlbums_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_LikedAlbums"
    ADD CONSTRAINT "_LikedAlbums_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."_LikedAlbums" DROP CONSTRAINT "_LikedAlbums_B_fkey";
       public          postgres    false    4719    235    217            �           2606    46192 "   _LikedArtists _LikedArtists_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_LikedArtists"
    ADD CONSTRAINT "_LikedArtists_A_fkey" FOREIGN KEY ("A") REFERENCES public."Artist"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."_LikedArtists" DROP CONSTRAINT "_LikedArtists_A_fkey";
       public          postgres    false    236    4733    227            �           2606    46197 "   _LikedArtists _LikedArtists_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_LikedArtists"
    ADD CONSTRAINT "_LikedArtists_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."_LikedArtists" DROP CONSTRAINT "_LikedArtists_B_fkey";
       public          postgres    false    217    4719    236            �           2606    46172     _LikedTracks _LikedTracks_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_LikedTracks"
    ADD CONSTRAINT "_LikedTracks_A_fkey" FOREIGN KEY ("A") REFERENCES public."Track"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."_LikedTracks" DROP CONSTRAINT "_LikedTracks_A_fkey";
       public          postgres    false    225    4731    234            �           2606    46177     _LikedTracks _LikedTracks_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_LikedTracks"
    ADD CONSTRAINT "_LikedTracks_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."_LikedTracks" DROP CONSTRAINT "_LikedTracks_B_fkey";
       public          postgres    false    4719    217    234            :      x������ � �      8   �   x�u�=�@@�z8�?��XX��J4A�&^�+X�x�$��3y�k>���r���|��1?���C�HV2w:n�66���Ǽ�Ĕ#�Cl@�1)IL"����e,�>�O����BU��~�(�!K�z�ѵ]6�8�g����(��7�      <      x������ � �      >   �  x�m��u%0D�Gn���P-9[C|��a@?�я�ŷԷė��}ݸ|S5�/��x�ʄ���Iu��W�u�5|����eF�6�V��4��sm'��";��k¨{����	����}&|���������]G�d2a��8����k,�]4(&W���j��l���	�����o�Á��0[���yo�p�U����3��Vh�����!x�&o��
����yS�a����!�	�5�$y�0D���{�U4GtW8P�yW>�+�=�|�/�^i]5�uc��(����=�CL��~+q�����(rǤZb*�r����HWŤڛ�ay�m�ø;�Ґ{R-��f�Eѽ�y�E�9J�U��c���PtՀ.�eW�~̈́�J�U��w1����svL6��j�ܒ�˄�]5��Xp<~���ԝ��      0   8   x�3�v�tIMK,�)Q(-N-R(��I�2�tt����LL���SH������� b��      4   �   x�͎�n�0 E��_$-�G��m�CK�%�BeM�d�������=���43�xT�T`t]Lz���T>rQ����=�=���y���$�*Hfu}��)o����I���Hnq���@(�h�hqV�>a�>'Q� ������&K�<2�V�����զT���}ZhhS���3�y�U�����;�A@n�'
J�_Q�n��.���n�D{�A��Ɨi��6{�      6   �  x�͒;n�0�k�)�ۊ2_�D���,�p��%��l���=M��:@�G
��p\�0R��~~�9y��	�=ND2���������;����������ZQe���R'�0N�˞�3�ٵ��(���K��ɤvn�SN���,|��|�3L8�5�#�1N0E�ݪ�4A��q	����	�b�k��}����Tu1�'xq��I��}�B΀^�c���ŋ_������ ����6�k|�����������"�P��p^	]�"+�y����E���1�g؇=<�D�]{n�mb�P���]+$����\䚪�(�2]u]0ˍD/_��Z��t�rT!��H�u57B���\{���~{���6~� �%����[�<lfX0L���l\�%ĕRR�GY���,��5]�2c9���n�=�5�      .   �   x���
�0 ���9����qvB������OY��_��}�bnycG82GOߐ�{Rj����e3��(�Ǹ�m���(�:�ƭ?<�]���pj��o��L�q�}Y�Z+�:�>�b�+UV��u��#���^���?5U+�      2      x�3�4�4�2�4�1z\\\ i      @      x������ � �      A      x������ � �      ?      x�3�4�2�=... ��      ,   �  x���Kj0��3�Ⱦx�,ٲ�=A`�e	BC��,z�zh�G(x%[������W//��W����˙�a��Hs�.��d�Ƞ1=DԼ����!#RϞ�n)=�*�tW���T	����.�*��$����������������YNm�~�֌G��mF/Q�*��������'ہ��1X��PR��ݩ�!ԛ�#B\���8kV��#�=�D?	�E�]�[_�Wz�h��-��e�QI[6}X��ڶ��F`�}�mnM<!���m��H�M�� �'E#�6~�o�	�Kπ$�����������=s����NKt=x�X��;�W��A9Ⱥ����bGF�v���C������Pϭ�+�v 6�z��Z����V|��������5�.�o���z{u��*u:�? �-�u     