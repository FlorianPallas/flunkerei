import { test, expect } from "@playwright/test";

test("2 Player session", async ({ browser }) => {
  const c1 = await browser.newContext();
  const bob = await c1.newPage();
  await bob.goto("/");

  // Bob creates a room
  await bob.getByRole("textbox").first().fill("Bob");
  await bob.getByRole("button", { name: "Raum erstellen" }).click();

  // Only Bob is in the room
  await expect(bob.getByText("Bob")).toBeVisible();
  await expect(bob.getByText("Alice")).not.toBeVisible();

  // Bob reads the room code
  const code = await bob
    .getByText(/\?code=/)
    .textContent()
    .then((t) => t.substring(t.length - 4));

  const c2 = await browser.newContext();
  const alice = await c2.newPage();
  await alice.goto("/");

  // Alice joins the room
  await alice.getByRole("textbox").nth(1).fill(code);
  await alice.getByRole("textbox").nth(2).fill("Alice");
  await alice.getByRole("button", { name: "Raum beitreten" }).click();

  // Both players are in the room from Alice's perspective
  await expect(alice.getByText("Bob")).toBeVisible();
  await expect(alice.getByText("Alice")).toBeVisible();

  // Both players are in the room from Bob's perspective
  await expect(bob.getByText("Bob")).toBeVisible();
  await expect(bob.getByText("Alice")).toBeVisible();

  // Both players ready up
  await bob.getByRole("button", { name: "Bereit" }).click();
  await alice.getByRole("button", { name: "Bereit" }).click();

  // Bob submits a question
  await expect(
    bob.getByText("Denke dir eine Frage für die anderen Spieler aus")
  ).toBeVisible();
  await bob.getByRole("textbox").fill("Was ist deine seltsamste Angewohnheit");
  await bob.getByRole("textbox").press("Enter");

  // Alice submits a question
  await expect(
    alice.getByText("Denke dir eine Frage für die anderen Spieler aus")
  ).toBeVisible();
  await alice
    .getByRole("textbox")
    .fill("Was war das spontanste, das du je gemacht hast");
  await alice.getByRole("textbox").press("Enter");

  // Bob answers Alice's question
  await expect(
    bob.getByText("Was war das spontanste, das du je gemacht hast")
  ).toBeVisible();
  await bob
    .getByRole("textbox")
    .fill("Ich habe spontan eine Reise nach Paris gebucht");
  await bob.getByRole("textbox").press("Enter");

  // Alice answers Bob's question
  await expect(
    alice.getByText("Was ist deine seltsamste Angewohnheit")
  ).toBeVisible();
  await alice.getByRole("textbox").fill("Ich esse gerne Pizza mit Ananas");
  await alice.getByRole("textbox").press("Enter");

  // Alice waits for Bob to submit a fitting lie, since she knows her own answer
  await expect(alice.getByText("Alice wurde gefragt")).toBeVisible();
  await expect(
    alice.getByText("Was ist deine seltsamste Angewohnheit")
  ).toBeVisible();
  await expect(
    alice.getByText(
      "Du bist das Opfer dieser Runde, du musst dir keine Lüge ausdenken!"
    )
  ).toBeVisible();

  // Bob submits a fitting lie for Alice's answer
  await expect(bob.getByText("Alice wurde gefragt")).toBeVisible();
  await expect(
    bob.getByText("Was ist deine seltsamste Angewohnheit")
  ).toBeVisible();
  await expect(
    bob.getByText("Denke dir eine Lüge aus die glaubwürdig klingt")
  ).toBeVisible();
  await bob.getByRole("textbox").fill("Ich esse Spaghetti immer mit Ketchup");
  await bob.getByRole("textbox").press("Enter");

  // Alice waits for Bob to pick what he thinks is the truth
  await expect(alice.getByText("Alice wurde gefragt")).toBeVisible();
  await expect(
    alice.getByText("Was ist deine seltsamste Angewohnheit")
  ).toBeVisible();
  await expect(
    alice.getByText(
      "Du hast die Wahrheit geschrieben, du darfst nicht mit abstimmen!"
    )
  ).toBeVisible();
  await expect(
    alice.getByText("Ich esse gerne Pizza mit Ananas")
  ).toBeVisible();
  await expect(
    alice.getByText("Ich esse Spaghetti immer mit Ketchup")
  ).toBeVisible();

  // Bob picks what he thinks is the truth
  await expect(bob.getByText("Alice wurde gefragt")).toBeVisible();
  await expect(
    bob.getByText("Was ist deine seltsamste Angewohnheit")
  ).toBeVisible();

  // TODO: display an instruction to pick the truth

  // Bob's own lie should not be visible
  await expect(
    bob.getByRole("button", { name: "Ich esse Spaghetti immer mit Ketchup" })
  ).not.toBeVisible();

  // Alice's truth should be visible
  await expect(
    bob.getByRole("button", { name: "Ich esse gerne Pizza mit Ananas" })
  ).toBeVisible();
  await bob
    .getByRole("button", { name: "Ich esse gerne Pizza mit Ananas" })
    .click();

  // TODO: reveal

  // The question is displayed for both players
  await expect(alice.getByText("Alice wurde gefragt")).toBeVisible();
  await expect(
    alice.getByText("Was ist deine seltsamste Angewohnheit")
  ).toBeVisible();
  await expect(bob.getByText("Alice wurde gefragt")).toBeVisible();
  await expect(
    bob.getByText("Was ist deine seltsamste Angewohnheit")
  ).toBeVisible();

  // The truth is revealed to both players
  await expect(
    alice.getByText("Ich esse gerne Pizza mit Ananas")
  ).toBeVisible();
  await expect(alice.getByText("Bob")).toBeVisible();
  await expect(alice.getByText("Die Wahrheit")).toBeVisible();

  await expect(bob.getByText("Ich esse gerne Pizza mit Ananas")).toBeVisible();
  await expect(alice.getByText("Bob")).toBeVisible();
  await expect(bob.getByText("Die Wahrheit")).toBeVisible();

  // Both players ready up
  await bob.getByRole("button", { name: "Bereit" }).click();
  await alice.getByRole("button", { name: "Bereit" }).click();

  // Bob waits for Alice to submit a fitting lie, since he knows his own answer
  await expect(bob.getByText("Bob wurde gefragt")).toBeVisible();
  await expect(
    bob.getByText("Was war das spontanste, das du je gemacht hast")
  ).toBeVisible();
  await expect(
    bob.getByText(
      "Du bist das Opfer dieser Runde, du musst dir keine Lüge ausdenken!"
    )
  ).toBeVisible();

  // Alice submits a fitting lie for Bob's answer
  await expect(alice.getByText("Bob wurde gefragt")).toBeVisible();
  await expect(
    alice.getByText("Was war das spontanste, das du je gemacht hast")
  ).toBeVisible();
  await expect(
    alice.getByText("Denke dir eine Lüge aus die glaubwürdig klingt")
  ).toBeVisible();
  await alice.getByRole("textbox").fill("Ich habe spontan geheiratet");
  await alice.getByRole("textbox").press("Enter");

  // Bob waits for Alice to pick what she thinks is the truth
  await expect(bob.getByText("Bob wurde gefragt")).toBeVisible();
  await expect(
    bob.getByText("Was war das spontanste, das du je gemacht hast")
  ).toBeVisible();
  await expect(
    bob.getByText(
      "Du hast die Wahrheit geschrieben, du darfst nicht mit abstimmen!"
    )
  ).toBeVisible();
  await expect(
    bob.getByText("Ich habe spontan eine Reise nach Paris gebucht")
  ).toBeVisible();
  await expect(bob.getByText("Ich habe spontan geheiratet")).toBeVisible();

  // Alice picks what she thinks is the truth
  await expect(alice.getByText("Bob wurde gefragt")).toBeVisible();
  await expect(
    alice.getByText("Was war das spontanste, das du je gemacht hast")
  ).toBeVisible();

  // Alice's lie should not be visible
  await expect(
    alice.getByRole("button", { name: "Ich habe spontan geheiratet" })
  ).not.toBeVisible();

  // Bob's truth should be visible
  await expect(
    alice.getByRole("button", {
      name: "Ich habe spontan eine Reise nach Paris gebucht",
    })
  ).toBeVisible();
  await alice
    .getByRole("button", {
      name: "Ich habe spontan eine Reise nach Paris gebucht",
    })
    .click();

  // The truth is revealed to both players
  await expect(
    alice.getByText("Ich habe spontan eine Reise nach Paris gebucht")
  ).toBeVisible();
  await expect(alice.getByText("Alice")).toBeVisible();
  await expect(alice.getByText("Die Wahrheit")).toBeVisible();

  await expect(
    bob.getByText("Ich habe spontan eine Reise nach Paris gebucht")
  ).toBeVisible();
  await expect(alice.getByText("Alice")).toBeVisible();
  await expect(bob.getByText("Die Wahrheit")).toBeVisible();

  // Both players ready up
  await bob.getByRole("button", { name: "Bereit" }).click();
  await alice.getByRole("button", { name: "Bereit" }).click();

  // Both players are back in the lobby
  await expect(alice.getByText("Flunkerei")).toBeVisible();
  await expect(bob.getByText("Flunkerei")).toBeVisible();

  // Both players are in the room from Alice's perspective
  await expect(alice.getByText("Bob")).toBeVisible();
  await expect(alice.getByText("Alice")).toBeVisible();

  // Both players are in the room from Bob's perspective
  await expect(bob.getByText("Bob")).toBeVisible();
  await expect(bob.getByText("Alice")).toBeVisible();
});
