import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useAuth } from "../ contexts/authUserContext";
import { Game } from "../interfaces/game.interface";
import { QUERY_GAMES, QUERY_USER } from "../utils/http";
import { QueryOrderDirection } from "../enums/api/query-order-direction.enum";
import GameRecordModal from "../components/modals/game-record-modal";
import GameRecord from "../components/game-record";
import PageNotFound from "./404";

const UserAccount = () => {
  const { authUser, loading } = useAuth();
  const [games, setGames] = useState<Game[]>();
  const [userHighscore, setUserHighScore] = useState<Game>();
  const [isLoadingNextGames, setIsLoadingNextGames] = useState<boolean>(false);
  const [gameLastKey, setGameLastKey] = useState<number | undefined>();
  const [isGameModalOpened, setIsGameModalOpened] = useState<boolean>(false);
  const [gameToDisplayInModal, setGameToDisplayInModal] = useState<Game>();

  const handleRecordClick = (game: Game) => {
    setGameToDisplayInModal(game);
    setIsGameModalOpened(true);
  };

  const getMoreGames = (lastKey: number | undefined) => {
    if (!loading && authUser && lastKey) {
      setIsLoadingNextGames(true);

      const getUserGames = async () =>
        QUERY_GAMES(
          10,
          { direction: QueryOrderDirection.DESC, fieldPath: "dateCreated" },
          authUser.uid,
          gameLastKey
        );

      getUserGames()
        .then(({ games, lastKey }) => {
          // @ts-ignore
          setGames((prev) => [...prev, ...games]);
          setGameLastKey(lastKey);
          setIsLoadingNextGames(false);
        })
        .catch();
    }
  };

  useEffect(() => {
    if (!loading && authUser) {
      Promise.all([
        QUERY_GAMES(
          10,
          { direction: QueryOrderDirection.DESC, fieldPath: "dateCreated" },
          authUser.uid
        ),
        QUERY_USER(authUser.uid),
      ])
        .then((data) => {
          const { games, lastKey } = data[0];
          // @ts-ignore
          const { highestScoringGame } = data[1].user;

          setUserHighScore(highestScoringGame);
          //@ts-ignore
          setGames(games);
          setGameLastKey(lastKey);
        })
        .catch(() => {});
    }
  }, [loading]);

  return (
    <Box mb={70}>
      {gameToDisplayInModal && (
        <GameRecordModal
          game={gameToDisplayInModal}
          isGameModalOpened={isGameModalOpened}
          setIsGameModalOpened={setIsGameModalOpened}
        />
      )}

      {loading && !authUser && <Loader size="sm" />}

      {!loading && !authUser && (
        <>
          <PageNotFound />
        </>
      )}

      {!loading && authUser && (
        <Box>
          <Title order={2}>My Account</Title>
          <Group grow>
            <Text size="sm" color="dimmed" mt={4}>
              Hello, {authUser.username}
            </Text>
            {games && games.length !== 0 && (
              <Text size="sm" align="right" color="dimmed">
                Showing {games.length} record{games.length !== 1 && "s"}
              </Text>
            )}
          </Group>

          <Box mt={30}>
            {!games && <Loader size="sm" />}

            {games && games.length === 0 && (
              <Text color="dimmed">No available data</Text>
            )}

            {games && games.length !== 0 && (
              <>
                {userHighscore && userHighscore.score !== 0 && (
                  <Box>
                    <Title order={5}>High Score</Title>
                    <Box
                      sx={(theme) => {
                        return {
                          backgroundColor: theme.colors.lime[4],
                          color: theme.colors.dark[9],
                          padding: theme.spacing.xs,
                          paddingLeft: theme.spacing.lg,
                          paddingRight: theme.spacing.lg,
                          cursor: "pointer",

                          "&:hover": {
                            backgroundColor: theme.colors.lime[5],
                          },
                        };
                      }}
                      onClick={() => handleRecordClick(userHighscore)}
                      mt={10}
                      mb={35}
                    >
                      <Group grow>
                        <Box>
                          <Text size="sm">
                            {authUser && `${authUser.username}`}
                          </Text>
                        </Box>
                        <Box>
                          <Group grow>
                            <Text size="sm" align="right">
                              {userHighscore?.wpm} wpm
                            </Text>
                            <Text size="sm" align="right">
                              {userHighscore?.score} points
                            </Text>
                          </Group>
                        </Box>
                      </Group>
                    </Box>
                  </Box>
                )}

                <Stack>
                  {games.map((game: Game, idx: number) => {
                    return (
                      <GameRecord
                        key={game.id}
                        index={idx}
                        game={game}
                        handleRecordClick={() => handleRecordClick(game)}
                        isLeaderboard={false}
                      />
                    );
                  })}
                </Stack>

                <Center mt={30}>
                  {gameLastKey ? (
                    <Button
                      onClick={() => getMoreGames(gameLastKey)}
                      loading={isLoadingNextGames}
                      size="xs"
                      variant="subtle"
                      color="gray"
                    >
                      Load more records
                    </Button>
                  ) : (
                    <Text size="xs">You&apos;re up-to-date!</Text>
                  )}
                </Center>
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserAccount;
